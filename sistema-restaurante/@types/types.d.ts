type RestaurantTableData = {
	_id: string
	name: string
	ordersTotalPrice: number
	ordersTotalQuantity: number
	customersQuantity: number
	occupiedAt: Date | null
}

type SizeItemMenu = {
	type: string
	price: number
}

type MenuItem = {
	optionName: string
	subtext?: string[]
	size: SizeItemMenu[]
}

type MenuSection = {
	name: string
	options: MenuItem[]
}

type OrderData = {
	_id?: string
	orderKey: string
	tableID: string
	itemID: string
	itemQuantity: number
	price: number
	clientNumber: number
	isFinished: boolean
	staffUser: string
	isClosed?: Date
}

type UserData = {
	name: string
	username: string
	role: string
}
