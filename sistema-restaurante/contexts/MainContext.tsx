"use client"
import { usePathname, useRouter } from "next/navigation"
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
	user: UserData | null
	setUser: Dispatch<SetStateAction<UserData | null>>
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

export const TableContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [orders, setOrders] = useState<OrderData[]>([])
	const [user, setUser] = useState<UserData | null>(null)
	const [notOrderedStack, setNotOrderedStack] = useState<OrderData[]>([])
	const [restaurantTables, setRestaurantTables] = useState<RestaurantTableData[]>([])
	const [isLoading, setIsLoading] = useState(true)

	const router = useRouter()
	const pathname = usePathname()

	useEffect(() => {
		setIsLoading(true)
		if(pathname == "/") setIsLoading(false)
		if (pathname != "/" && !user) router.push("/")
	}, [user])

	return (
		<RestaurantTableContext.Provider value={{
			user, setUser,
			orders, setOrders,
			notOrderedStack,
			setNotOrderedStack,
			restaurantTables, setRestaurantTables
		}}>
			{children}
		</RestaurantTableContext.Provider>
	)
}

export const useBaseContext = (): ContextProps => {
	const contexto = useContext(RestaurantTableContext)
	if (!contexto) {
		throw new Error("useBaseContext deve ser utilizado dentro de um TableContextProvider")
	}
	return contexto
}
