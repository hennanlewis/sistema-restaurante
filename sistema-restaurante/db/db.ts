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
        await client.close()
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
        await client.close()
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
        await client.close()
    }
}

export async function insertUser(data: UserData) {
    try {
        await client.connect()
        const response = await client.db(DATABASE_NAME).collection("users").insertOne(data)
        return response
    } finally {
        await client.close()
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
        await client.close()
    }
}

export async function getRestaurantTables() {
    try {
        await client.connect()
        const cursor = client.db(DATABASE_NAME).collection("tables").find()
        const tables = await cursor.toArray()
        return tables
    } finally {
        await client.close()
    }
}

export async function insertTable(data: UserData) {
    try {
        await client.connect()
        const response = await client.db(DATABASE_NAME).collection("tables").insertOne(data)
        return response
    } finally {
        await client.close()
    }
}

export async function occupyTable(tableId: string) {
    try {
        await client.connect()
        const occupiedAt = new Date()
        console.log(tableId, occupiedAt)
        const filter = { _id: new ObjectId(tableId) }
        const update = { $set: { occupiedAt } }
        const response = await client.db(DATABASE_NAME)
            .collection("tables").updateOne(filter, update)

        if (response && response.matchedCount === 1) return occupiedAt
        return null
    } finally {
        await client.close()
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
        await client.close()
    }
}

export async function getHost(restaurant: string) {
    try {
        await client.connect()
        const response = await client.db(DATABASE_NAME).collection("info")
            .findOne({ restaurant }, { projection: { host: 1 } })
        return response
    } finally {
        await client.close()
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
        await client.close()
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
        await client.close()
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
        await client.close()
    }
}

export async function getOrders() {
    try {
        await client.connect()

        const cursor = client.db(DATABASE_NAME).collection("orders").find()
        const response = await cursor.toArray()

        return response
    } catch (error) {
        console.log(error)
    } finally {
        await client.close()
    }
}
