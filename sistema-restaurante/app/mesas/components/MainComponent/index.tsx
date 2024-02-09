"use client"
import { useEffect, useRef } from "react"
import { IoMdArrowBack } from "react-icons/io"

import { useBaseContext } from "@/contexts/MainContext"

import style from "../../restaurante.module.css"
import { TableBody } from "../TableBody"
import { TableHead } from "../TableHead"
import { useRouter } from "next/navigation"
import { sumArrayValues } from "@/utils/dataFormater"

type MainComponentProps = {
    restaurantTablesFromAPI: RestaurantTableData[]
    restaurantOrdersFromAPI: OrderData[]
}

export function MainComponent({ restaurantTablesFromAPI, restaurantOrdersFromAPI }: MainComponentProps) {
    const { restaurantTables, setRestaurantTables, orders, setOrders } = useBaseContext()
    const router = useRouter()
    const countRender = useRef(0)

    const mainPage = () => router.push("/dashboard")

    const dataRequest = async () => {
        const ordersRes = await fetch("/api/pedidos")
        const ordersTotal: OrderData[] = await ordersRes.json()
        setOrders(ordersTotal)


        const tableRes = await fetch("/api/mesas")
        const tables: RestaurantTableData[] = await tableRes.json()
        setRestaurantTables(tables
            .map(table => ({
                ...table,
                ordersTotalQuantity: sumArrayValues(ordersTotal.
                    filter(order => order.tableID == table.name)
                    .map(order => order.itemQuantity)
                )
            }))
        )
    }

    useEffect(() => {
        dataRequest()
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
