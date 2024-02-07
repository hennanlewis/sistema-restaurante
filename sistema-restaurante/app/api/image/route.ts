import { insertImage } from "@/db/db"
import { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
    try {
        const imageData = await request.json()
        console.log("Image received:", imageData)
        const response = await insertImage(imageData)
        if (response !== null) {
            return Response.json("Image received successfully!", { status: 200 })
        }
        throw new Error("Image not saved")
    } catch (error) {
        return new Response(`Webhook error: ${error}`, {
            status: 400,
        })
    }
}