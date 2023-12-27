import { searchStaffInfo } from "@/services/searchStaffInfo"
import { searchRestaurantTableData } from "@/services/searchTablesInfo"

export async function GET() {
	const tables = await searchRestaurantTableData()
	const staff = await searchStaffInfo()
	return Response.json({ tables_info: tables, staff_info: staff })
}