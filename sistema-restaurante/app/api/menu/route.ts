import { getDishes } from "@/db/db"

export async function GET() {
    const menu = await getDishes()
    return Response.json(menu, { status: 200 })
}