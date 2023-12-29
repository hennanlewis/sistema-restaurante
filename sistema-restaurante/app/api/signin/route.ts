import { getUser } from "@/db/db"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
	const body = await req.json()
	const { username, password } = body
	if (req.method == "POST") {
		const user = await getUser(username, password)
		return NextResponse.json(user)
	}
}
