import { MongoClient, WithId } from "mongodb"

const DATABASE_URI = process.env.DATABASE_URI || ""
const client = new MongoClient(DATABASE_URI, {})

const DATABASE_NAME = process.env.DATABASE_NAME || ""

export async function db(collection: string) {
	await client.connect()
	return  client.db(DATABASE_NAME).collection(collection)
}
