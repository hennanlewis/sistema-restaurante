import { getRestaurantTables, occupyTable } from "@/db/db"
import { NextRequest } from "next/server"

export async function GET() {
    const restaurantTables = await getRestaurantTables()
    return Response.json(restaurantTables)
}

export async function PUT(req: NextRequest) {
    try {
        const { tableId } = await req.json()
        const result = await occupyTable(tableId)
        if (result !== null) {
            return Response.json(result, { status: 200 })
        }
        throw new Error('Table not found in the result')
    } catch (error) {
        return new Response(`Webhook error: ${error}`, {
            status: 400,
        })
    }
}
