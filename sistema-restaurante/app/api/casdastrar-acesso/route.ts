import { insertUser } from "@/db/db"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
	const user = await req.json()
	const result = await insertUser(user)
	return NextResponse.json(result)
}
