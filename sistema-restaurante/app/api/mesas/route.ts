import { getRestaurantTables } from "@/db/db"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
	const restaurantTables = await getRestaurantTables()
	return NextResponse.json(restaurantTables)
}
