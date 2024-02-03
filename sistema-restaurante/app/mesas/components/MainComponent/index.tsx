"use client"
import { useEffect } from "react"
import { useBaseContext } from "@/contexts/MainContext"

import { TableBody } from "../TableBody"
import { TableHead } from "../TableHead"
import style from "../../restaurante.module.css"

type MainComponentProps = {
	restaurantTablesFromAPI: RestaurantTableData[]
    restaurantOrdersFromAPI: OrderData[]
}

export function MainComponent({ restaurantTablesFromAPI, restaurantOrdersFromAPI }: MainComponentProps) {
	const { restaurantTables, setRestaurantTables, orders, setOrders  } = useBaseContext()

	useEffect(() => {
		setRestaurantTables(currentValues => restaurantTables.length == 0 ? restaurantTablesFromAPI : currentValues)
        setOrders(currentValues => orders.length == 0 ? restaurantOrdersFromAPI : currentValues)
	}, [])


	return (
		<main className={style.main}>
			<div className={style.table}>
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
