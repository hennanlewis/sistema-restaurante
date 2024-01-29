type RestaurantTableData = {
	_id: string
	name: string
	ordersTotalPrice: number
	ordersTotalQuantity: number
	customersQuantity: number
	occupiedAt: Date | null
}

type SizeItemMenu = {
}

type MenuItem = {
    _id?: string
	dishName: string
    subtext: string[]
    servingsCount: string
    dishPrice: number
}

type MenuSection = {
    _id?: string
	name: string
	options: MenuItem[]
}

type OrderData = {
	_id?: string
    itemID: string
	tableID: string
	itemQuantity: number
    dishName: string
	dishPrice: number
    servingsCount: string
    sectionName: string
	clientNumber: number
	isFinished: boolean
	employeer: string
	isClosed?: Date
}

type UserData = {
	name: string
	username: string
	role: string
}

type UserDataFull = UserData & {
    password: string
    id: string
    deletedAt?: Date
}

type DishDBInsertion = {
    sectionName: string
    dishName: string
    servingsCount: string
    dishPrice: number
    subtext: string
}
