import { getRestaurantTables, occupyTable, updateTable } from "@/db/db"
import exp from "constants"
import { NextRequest } from "next/server"

export async function GET() {
    const restaurantTables = await getRestaurantTables()
    return Response.json(restaurantTables)
}

export async function POST(req: NextRequest) {
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

export async function PUT(req: NextRequest) {
    try {
        const table = await req.json()
        const result = await updateTable(table)
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
