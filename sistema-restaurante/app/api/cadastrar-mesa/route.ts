import { insertTable } from "@/db/db"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
	const table = await req.json()
	const result = await insertTable(table)
	return NextResponse.json(result)
}
