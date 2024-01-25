import { MongoClient, WithId } from "mongodb"

const DATABASE_URI = process.env.DATABASE_URI || ""
const client = new MongoClient(DATABASE_URI, {})

const DATABASE_NAME = process.env.DATABASE_NAME || ""

export async function getUser(username: string, password: string) {
    try {
        await client.connect()
        const user = await client.db(DATABASE_NAME).collection("users")
            .findOne<UserData>({ username, password }, { projection: { _id: 0, password: 0 } })
        return user
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

export async function insertUser(data: UserData) {
    try {
        await client.connect()
        const response = await client.db(DATABASE_NAME).collection("users").insertOne(data)
        return response
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

export async function insertDish(dish: DishDBInsertion) {
    const { sectionName, dishName, servingsCount, dishPrice, subtext } = dish
    try {
        await client.connect()

        const filter = { name: sectionName }
        const update = {
            $push: {
                options: { dishName, servingsCount, dishPrice, subtext }
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
