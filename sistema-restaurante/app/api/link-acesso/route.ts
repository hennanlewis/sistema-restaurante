import { getHost, setHost } from "@/db/db"
import { NextRequest } from "next/server"

export async function PUT(req: NextRequest) {
    try {
        const { ip, restaurant } = await req.json()
        const result = await setHost(ip, restaurant)
        if (result && result.matchedCount == 1)
            return Response.json({ host: `http://${ip}:3000` }, { status: 200 })

        return Response.json({ host: process.env.VERCEL_URL }, { status: 200 })
    } catch (error) {
        return new Response(`Webhook error: ${error}`, {
            status: 400,
        })
    }
}

export async function POST(req: NextRequest) {
    try {
        const { restaurant } = await req.json()
        const result = await getHost(restaurant)
        if (result !== null && result.host) {
            const formattedResult = { host: result.host }
            return Response.json(formattedResult, { status: 200 })
        }
        throw new Error('IP not found in the result')
    } catch (error) {
        return new Response(`Webhook error: ${error}`, {
            status: 400,
        })
    }
}
