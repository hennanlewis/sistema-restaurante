import { setHost } from "@/db/db"
import { NextRequest } from "next/server"

export async function PUT(req: NextRequest) {
    try {
        const { ip, restaurant } = await req.json()
        const result = await setHost(ip, restaurant)
        if (result && result.matchedCount == 1)
            return Response.json({ host: `http://${ip}:3000` }, { status: 200 })

        throw new Error('Restaurant not found in the result')
    } catch (error) {
        return new Response(`Webhook error: ${error}`, {
            status: 400,
        })
    }
}
