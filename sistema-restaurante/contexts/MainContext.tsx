"use client"
import { useCustomHook } from "@/hooks/customHook"
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
    ordersWithID: OrderData[]
    incrementalHexNumber: () => string
    setOrders: Dispatch<SetStateAction<OrderData[]>>
    notOrderedStack: OrderData[]
    setNotOrderedStack: Dispatch<SetStateAction<OrderData[]>>
    restaurantTables: RestaurantTableData[]
    setRestaurantTables: Dispatch<SetStateAction<RestaurantTableData[]>>
}

const RestaurantTableContext = createContext<ContextProps | undefined>(undefined)

export const TableContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [orders, setOrders] = useState<OrderData[]>([])
    const [user, setUser] = useState<UserData | null>(null)
    const [notOrderedStack, setNotOrderedStack] = useState<OrderData[]>([])
    const [restaurantTables, setRestaurantTables] = useState<RestaurantTableData[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const ordersWithID = orders.filter(order => order.keyOrderID)
    if (ordersWithID.length > 0) console.log("Pedidos com ID", ordersWithID)

    const router = useRouter()
    const pathname = usePathname()
    const customHook = useCustomHook()

    let incrementalValue = 0
    const incrementalHexNumber = () => {
        incrementalValue++
        return incrementalValue.toString(16)
    }

    useEffect(() => {
        setIsLoading(true)
        if (customHook) setUser(customHook)
        if (pathname == "/" && user) router.push("/dashboard")
        if (!user) router.push("/")
        setIsLoading(false)
    }, [user, pathname])

    return (
        <RestaurantTableContext.Provider value={{
            user, setUser,
            ordersWithID,
            orders, setOrders,
            incrementalHexNumber,
            notOrderedStack,
            setNotOrderedStack,
            restaurantTables, setRestaurantTables
        }}>
            {!isLoading && children}
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
