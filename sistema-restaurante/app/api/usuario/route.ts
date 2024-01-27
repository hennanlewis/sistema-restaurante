import { getUserById, getUsers, insertUser, updateUser } from "@/db/db"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    const user = await req.json()
    const result = await insertUser(user)
    return NextResponse.json(result)
}

export async function GET(req: NextRequest) {
    const id = req.nextUrl.searchParams.get("id")

    if (id) {
        const result = await getUserById(id)
        return Response.json(result, { status: 200 })
    }

    const result = await getUsers()
    return NextResponse.json(result)
}

export async function PUT(req: NextRequest) {
    try {
        const user = await req.json()
        const result = await updateUser(user)
        if (result !== null) {
            return Response.json(result, { status: 200 })
        }
        throw new Error('Dish section not found in the result')
    } catch (error) {
        return new Response(`Webhook error: ${error}`, {
            status: 400,
        })
    }
}
