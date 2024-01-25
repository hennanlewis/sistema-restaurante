import { getDishCategories } from "@/db/db"

export async function GET() {

    try {
        const result = await getDishCategories()
        if (result !== null) {
            return Response.json(result, { status: 200 })
        }
        return new Response("Dish section not found in the result", {
            status: 404,
        })
    } catch (error) {
        return new Response(`Webhook error: ${error}`, {
            status: 400,
        })
    }
}
