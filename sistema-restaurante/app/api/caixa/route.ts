import { getCash } from "@/db/db"

export async function GET() {
    const menu = await getCash()
    return Response.json(menu, { status: 200 })
}
