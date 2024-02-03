import { getOrders } from "@/db/db"
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
