export const currencyFormater = (value: number) =>
	new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL"
	}).format(value)

export const listFormater = (string: string[]) =>
	capitalizeFirstLetters(new Intl.ListFormat("pt-BR", {
		style: "long",
		type: "conjunction",
	}).format(string))

export const capitalizeFirstLetters = (string: string) => {
	if (string.length == 0) return string
	return string.charAt(0).toUpperCase() + string.slice(1)
}

export const sumArrayValues = (array: number[]) => 
	array.reduce((sum, itemValue) => sum += itemValue, 0)

export const str2Slug = (input: string) => input.toLocaleLowerCase().replace(" ", "_")

export const showedOrdersFormater = (orders: OrderData[]) => {
	const filteredOrders: OrderData[] = []
	for (const order of orders) {
		const itemTotalQuantity = orders.filter(item => item.itemID == order.itemID).length
		const isOnFilteredOrders = filteredOrders.some(item => item.itemID == order.itemID)
		if (!isOnFilteredOrders) {
			filteredOrders.push({ ...order, itemQuantity: itemTotalQuantity })
		}
	}
	return filteredOrders
}
