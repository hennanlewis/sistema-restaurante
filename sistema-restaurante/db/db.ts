import { ObjectId } from 'mongodb'
import { MongoClient, WithId } from "mongodb"

const DATABASE_URI = process.env.DATABASE_URI || ""
const client = new MongoClient(DATABASE_URI, {})

const DATABASE_NAME = process.env.DATABASE_NAME || ""

export async function login(username: string, password: string) {
    try {
        await client.connect()
        const user = await client.db(DATABASE_NAME).collection("users")
            .findOne<UserData>({ username, password }, { projection: { _id: 0, password: 0 } })
        return user
    } finally {
        console.log("Closing Login connection")
    }
}

export async function getUserById(id: string) {
    try {
        await client.connect()

        const filter = { _id: new ObjectId(id), role: { $ne: "admin" } }
        const projection = { projection: { password: 0 } }
        const users = await client.db(DATABASE_NAME).collection("users")
            .find(filter, projection)
            .toArray()

        return users
    } finally {
        console.log("Closing getUserById connection")
    }
}

export async function getUsers() {
    try {
        await client.connect()

        const users = await client.db(DATABASE_NAME).collection("users")
            .find({ role: { $ne: "admin" }, deletedAt: { $exists: false } }, { projection: { _id: 1, name: 1 } })
            .toArray()

        return users
    } finally {
        console.log("Closing getUsers connection")
    }
}

export async function insertUser(data: UserData) {
    try {
        await client.connect()
        const response = await client.db(DATABASE_NAME).collection("users").insertOne(data)
        return response
    } finally {
        console.log("Closing insertUser connection")
    }
}

export async function updateUser(data: UserDataFull & { status: string }) {
    const { id, status, ...rest } = data
    try {
        await client.connect()
        let response = null

        if (status === "desligado") {
            response = await client
                .db(DATABASE_NAME)
                .collection("users")
                .updateOne({ _id: new ObjectId(id), deletedAt: { $exists: false } }, { $set: { ...rest, deletedAt: new Date() } })
        }

        if (status === "desligado") {
            response = await client
                .db(DATABASE_NAME)
                .collection("users")
                .updateOne({ _id: new ObjectId(id) }, { $set: { ...rest, deletedAt: new Date() } })
        }

        if (response && response.matchedCount === 1) return data
        return null
    } finally {
        console.log("Closing updateUser connection")
    }
}

export async function getRestaurantTables() {
    try {
        await client.connect()
        const cursor = client.db(DATABASE_NAME).collection("tables").find()
        const tables = await cursor.toArray()
        return tables
    } finally {
        console.log("Closing getRestaurantTables connection")
    }
}

export async function insertTable(data: UserData) {
    try {
        await client.connect()
        const response = await client.db(DATABASE_NAME).collection("tables").insertOne(data)
        return response
    } finally {
        console.log("Closing insertTable connection")
    }
}

export async function occupyTable(tableId: string) {
    try {
        await client.connect()
        const occupiedAt = new Date()

        const filter = { _id: new ObjectId(tableId) }
        const update = { $set: { occupiedAt } }
        const response = await client.db(DATABASE_NAME)
            .collection("tables").updateOne(filter, update)

        if (response && response.matchedCount === 1) return occupiedAt
        return null
    } finally {
        console.log("Closing occupyTable connection")
    }
}

export async function updateTable(table: RestaurantTableData) {
    try {
        await client.connect()
        const { _id, ...rest } = table
        const filter = { _id: new ObjectId(table._id) }
        const update = { $set: rest }
        const response = await client.db(DATABASE_NAME)
            .collection("tables").updateOne(filter, update)

        if (response && response.matchedCount === 1) return table
        return null
    } finally {
        console.log("Closing updateTable connection")
    }
}

export async function setHost(ip: string, restaurant: string) {
    try {
        await client.connect()
        const filter = { restaurant }
        const host = `http://${ip}:3000`
        const update = { $set: { host } }
        const response = await client.db(DATABASE_NAME).collection("info")
            .updateOne(filter, update)
        return response
    } catch (error) {
        console.log(error)
    } finally {
        console.log("Closing setHost connection")
    }
}

export async function getHost(restaurant: string) {
    try {
        await client.connect()
        const response = await client.db(DATABASE_NAME).collection("info")
            .findOne({ restaurant }, { projection: { host: 1 } })
        return response
    } finally {
        console.log("Closing getHost connection")
    }
}

export async function getDishCategories() {
    try {
        await client.connect()

        const cursor = client.db(DATABASE_NAME).collection("menu").find()
        const response = await cursor.toArray()

        return response
    } catch (error) {
        console.log(error)
    } finally {
        console.log("Closing getDishCategories connection")
    }
}

export async function getDishes() {
    try {
        await client.connect()

        const cursor = client.db(DATABASE_NAME).collection("menu")
            .find()

        const response: MenuSection[] = await cursor.toArray() as any[]
        const dishes = response.map((section) => {
            return {
                menuSectionId: String(section._id),
                name: section.name,
                options: section.options.map(dish => {
                    const { _id, ...rest } = dish
                    return { ...rest, dishId: _id }
                })
            }
        })

        return dishes
    } catch (error) {
        console.log(error)
    } finally {
        console.log("Closing getDishes connection")
    }

}

export async function insertDish(dish: DishDBInsertion) {
    const { sectionName, dishName, servingsCount, dishPrice, subtext } = dish

    try {
        await client.connect()

        const filter = { name: sectionName }

        const newDish = {
            _id: new ObjectId(),
            dishName,
            servingsCount,
            dishPrice,
            subtext
        }

        const update = {
            $push: {
                options: newDish
            }
        }

        const response = await client.db(DATABASE_NAME).collection("menu")
            .updateOne(filter, update)

        return response
    } catch (error) {
        console.log(error)
    } finally {
        console.log("Closing insertDish connection")
    }
}

export async function getOrders() {
    try {
        await client.connect()

        const cursor = client.db(DATABASE_NAME).collection("orders").find({ finishedAt: { $exists: false } })
        const response = await cursor.toArray()

        return response
    } catch (error) {
        console.log(error)
    } finally {
        console.log()
    }
}

export async function insertOrders(orders: OrderData[]) {
    try {
        await client.connect()
        const filteredOrders = orders.map(order => {
            return { ...order, _id: new ObjectId() }
        })
        const response = await client.db(DATABASE_NAME).collection("orders").insertMany(filteredOrders)
        if (response.insertedCount === orders.length) {
            const placedOrders = await getOrders()
            return placedOrders
        }
        return []
    } catch (error) {
        console.log(error)
    } finally {
        console.log("Closing insertOrders connection")
    }
}

export async function updateOrder(order: OrderData) {
    try {
        await client.connect()
        const filter = { keyOrderId: order.keyOrderID }
        const { _id, ...rest } = order
        const response = await client.db(DATABASE_NAME).collection("orders").updateOne(filter, { $set: rest })
        return response
    } catch (error) {
        console.log(error)
    } finally {
        console.log("Closing updateOrder connection")
    }
}

export async function deleteOrder(id: string) {
    try {
        await client.connect()
        const response = await client.db(DATABASE_NAME).collection("orders")
            .deleteOne({ _id: new ObjectId(id) })
        return response
    } catch (error) {
        console.log(error)
    } finally {
        console.log("Closing deleteOrder connection")
    }
}

export async function finishOrders(orderIds: string[]) {
    try {
        await client.connect()

        const bulkOperations = orderIds.map(ids => ({
            updateOne: {
                filter: { _id: new ObjectId(ids) },
                update: {
                    $set: { finishedAt: new Date() }
                }
            }
        }))

        const bulkResult = await client.db(DATABASE_NAME).collection("orders").bulkWrite(bulkOperations)

        return orderIds
    } catch (error) {
        console.error(error)
    } finally {
        console.log("Closing finishOrders connection")
    }
}

export async function insertTag(finishedData: Object) {
    try {
        await client.connect()
        const updatedData = {...finishedData, finishedAt: new Date() }

        const bulkResult = await client.db(DATABASE_NAME).collection("tags").insertOne(updatedData)
        console.log(bulkResult)

        return finishedData
    } catch (error) {
        console.error(error)
    } finally {
        await client.close()
    }
}

export async function insertImage(imageData: string) {
    try {
        await client.connect()
        const existingImage = await client.db(DATABASE_NAME).collection("images").findOne({ imageData })
        if (existingImage) {
            console.log("Image already exists:", existingImage)
            return null
        }
        const response = await client.db(DATABASE_NAME).collection("images").insertOne({ imageData })
        console.log("Image inserted:", response)
        return response

    } catch (error) {
        console.error(error)
    } finally {
        console.log("Closing insertImage connection")
    }
}

export async function getCash() {
    try {
        await client.connect()

        const today = new Date()
        today.setUTCHours(0, 0, 0, 0)

        console.log(today.getTime())
        const cursor = client.db(DATABASE_NAME).collection("tags").find({
            finishedAt: {
                $gte: new Date(today.getTime()),
                $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
            }
        })

        const response = await cursor.toArray()
        console.log(response)
        return response
    } catch (error) {
        console.error(error)
    } finally {
        console.log("Closing getCash connection")
    }
}
