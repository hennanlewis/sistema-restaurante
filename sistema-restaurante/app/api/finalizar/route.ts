import { finishOrders, insertTag } from "@/db/db"
import { NextRequest } from "next/server"

export async function PUT(request: NextRequest) {
    try {
        const orderIds = await request.json()
        const updatedData = await finishOrders(orderIds)
        return Response.json(updatedData, { status: 200 })
    } catch (error) {
        return new Response(`Webhook error: ${error}`, {
            status: 400,
        })
    }
}

export async function POST(request: NextRequest) {
    try {
        const finishedData = await request.json()
        const updatedData = await insertTag(finishedData)
        return Response.json(updatedData, { status: 200 })
    } catch (error) {
        return new Response(`Webhook error: ${error}`, {
            status: 400,
        })
    }
}
