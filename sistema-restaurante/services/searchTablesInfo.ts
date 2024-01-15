export async function searchRestaurantTableData() {
	const baseArray = Array.from({ length: 7 }, (_, index) => ++index)
	const values : RestaurantTableData[] = []

	const addItem = (tableNumber: number) : RestaurantTableData => {
        const teste : RestaurantTableData = {} as RestaurantTableData
		teste.name = String(++tableNumber)
		teste.customersQuantity = Math.round(( 3 * Math.random()))
		teste.ordersTotalPrice = teste.customersQuantity == 0 ? 0 : Math.round(Math.random() * 50 * tableNumber) + 30
		teste.ordersTotalQuantity = teste.customersQuantity == 0 ? 0 : Math.ceil(teste.ordersTotalPrice / (25 + Math.random() * 25))
		teste.occupiedAt = teste.customersQuantity == 0 ? null : new Date(Date.now() - Math.round(Math.random() * 600000))

		return teste
	}

	for (const item in baseArray) {
		values.push(addItem(Number(item)))
	}

	return values
}