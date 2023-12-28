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
