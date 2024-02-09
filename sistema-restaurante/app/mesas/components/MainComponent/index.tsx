"use client"
import { useEffect } from "react"
import { IoMdArrowBack } from "react-icons/io"

import { useBaseContext } from "@/contexts/MainContext"

import style from "../../restaurante.module.css"
import { TableBody } from "../TableBody"
import { TableHead } from "../TableHead"
import { useRouter } from "next/navigation"

type MainComponentProps = {
    restaurantTablesFromAPI: RestaurantTableData[]
    restaurantOrdersFromAPI: OrderData[]
}

export function MainComponent({ restaurantTablesFromAPI, restaurantOrdersFromAPI }: MainComponentProps) {
    const { restaurantTables, setRestaurantTables, orders, setOrders } = useBaseContext()
    const router = useRouter()

    const mainPage = () => router.push("/dashboard")

    useEffect(() => {
        setRestaurantTables(currentValues => restaurantTables.length == 0 ? restaurantTablesFromAPI : currentValues)
        setOrders(currentValues => orders.length == 0 ? restaurantOrdersFromAPI : currentValues)
    }, [])

    return (
        <main className={style.main}>
            <div className={style.table}>
                <div className={style.topOptions}>
                    <button onClick={mainPage}><IoMdArrowBack /><span>Voltar</span></button>
                </div>
                <TableHead />
                <TableBody />
                {/* <div className={style.orders}>
					{currencyFormater(restaurantTables
						.reduce((sum, restaurantTable) => sum += restaurantTable.orderValue, 0)
					)}
				</div> */}
            </div>
        </main>
    )
}
