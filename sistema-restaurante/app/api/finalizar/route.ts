import { finishOrders, getOrders, insertOrders, updateOrder } from "@/db/db"
import { NextRequest } from "next/server"

export async function PUT(request: NextRequest) {
    try {
        const orders = await request.json()
        const updatedData = await finishOrders(orders)
        return Response.json(updatedData, { status: 200 })
    } catch (error) {
        return new Response(`Webhook error: ${error}`, {
            status: 400,
        })
    }
}
