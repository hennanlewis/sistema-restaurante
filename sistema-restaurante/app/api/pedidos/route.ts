import { getOrders, insertOrders } from "@/db/db"
import { ObjectId } from "mongodb"
import { NextRequest } from "next/server"

export async function GET() {
    try {
        const orders = await getOrders()
        return Response.json(orders, { status: 200 })
    } catch (error) {
        return new Response(`Webhook error: ${error}`, {
            status: 400,
        })
    }
}

export async function POST(request: NextRequest) {
    try {
        const orders = await request.json()
        const insertionData = await insertOrders(orders)
        return Response.json(insertionData, { status: 200 })
    } catch (error) {
        return new Response(`Webhook error: ${error}`, {
            status: 400,
        })
    }
}
