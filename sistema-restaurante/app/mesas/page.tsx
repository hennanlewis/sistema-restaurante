import { MainComponent } from "./components/MainComponent"

async function getTables() {
	const url = `${process.env.VERCEL_URL}/api/mesas`
	const response = await fetch(url)
	return response.json()
}

export default async function RestaurantTables() {
	const restaurantTables: RestaurantTableData[] = await getTables()

	return <MainComponent restaurantTables={restaurantTables} />
}
