"use client"
import React, {
	createContext,
	useContext,
	useState,
	ReactNode,
	SetStateAction,
	Dispatch,
	useEffect
} from "react"

type ContextProps = {
	orders: OrderData[]
	setOrders: Dispatch<SetStateAction<OrderData[]>>
	notOrderedStack: OrderData[]
	setNotOrderedStack: Dispatch<SetStateAction<OrderData[]>>
	restaurantTables: RestaurantTableData[]
	setRestaurantTables: Dispatch<SetStateAction<RestaurantTableData[]>>
}

const RestaurantTableContext = createContext<ContextProps | undefined>(undefined)

type fetchDataResult = {
	tables_info: RestaurantTableData[]
	staff_info: number
}

const getData = async () => {
	const url = `/api/table-info`
	const result = await fetch(url, { next: { revalidate: 300 } })
	return result.json()
}

export const TableContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [orders, setOrders] = useState<OrderData[]>([])
	const [notOrderedStack, setNotOrderedStack] = useState<OrderData[]>([])
	const [restaurantTables, setRestaurantTables] = useState<RestaurantTableData[]>([])
	const [isLoading, setIsloading] = useState(true)

	useEffect(() => {
		const getTablesInfo = async () => {
			const { tables_info: tablesInfo, staff_info: staffInfo }: fetchDataResult = await getData()
			setRestaurantTables([...tablesInfo])
			setIsloading(false)
		}
		getTablesInfo()
	}, [])

	return (
		<RestaurantTableContext.Provider value={{
			orders, setOrders, notOrderedStack, setNotOrderedStack, restaurantTables, setRestaurantTables
		}}>
			{children}
		</RestaurantTableContext.Provider>
	)
}

export const useTableContext = (): ContextProps => {
	const contexto = useContext(RestaurantTableContext)
	if (!contexto) {
		throw new Error("useTableContext deve ser utilizado dentro de um TableContextProvider")
	}
	return contexto
}
