import { insertDish } from "@/db/db"
import { NextRequest } from "next/server"

export async function POST(req: NextRequest) {

    try {
        const dish: DishDBInsertion = await req.json()
        const result = await insertDish(dish)
        if (result !== null) {
            return Response.json(result, { status: 200 })
        }
        throw new Error("Dish section not found in the result")
    } catch (error) {
        return new Response(`Webhook error: ${error}`, {
            status: 400,
        })
    }
}
