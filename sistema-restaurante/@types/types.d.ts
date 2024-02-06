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
    dishId: string
	dishName: string
    subtext: string[]
    servingsCount: string
    dishPrice: number
}

type MenuSection = {
    _id?: string
    menuSectionId: string
	name: string
	options: MenuItem[]
}

type OrderData = {
    _id: string
	keyOrderID: string
    dishID: string
	tableID: string
	itemQuantity: number
    dishName: string
	dishPrice: number
    servingsCount: string
    sectionName: string
	clientNumber: number
	isPlaced: boolean
	employeer: string
	isClosed?: Date
    info: string
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
