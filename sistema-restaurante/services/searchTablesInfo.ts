export async function searchRestaurantTableData() {
	const baseArray = Array.from({ length: 7 }, (_, index) => ++index)
	const values : RestaurantTableData[] = []

	const addItem = (tableNumber: number) : RestaurantTableData => {
		const name = String(++tableNumber)
		const customersQuantity = Math.round(( 3 * Math.random()))
		const ordersTotalPrice = customersQuantity == 0 ? 0 : Math.round(Math.random() * 50 * tableNumber) + 30
		const ordersTotalQuantity = customersQuantity == 0 ? 0 : Math.ceil(ordersTotalPrice / (25 + Math.random() * 25))
		const occupiedAt = customersQuantity == 0 ? null : new Date(Date.now() - Math.round(Math.random() * 600000))

		return { name, ordersTotalPrice, ordersTotalQuantity, customersQuantity, occupiedAt }
	}

	for (const item in baseArray) {
		values.push(addItem(Number(item)))
	}

	return values
}