"use client"
import { useEffect } from "react"
import { useBaseContext } from "@/contexts/MainContext"

import { TableBody } from "../TableBody"
import { TableHead } from "../TableHead"
import style from "../../restaurante.module.css"

type MainComponentProps = {
	restaurantTablesFromAPI: RestaurantTableData[]
}

export function MainComponent({ restaurantTablesFromAPI }: MainComponentProps) {
	const { restaurantTables, setRestaurantTables } = useBaseContext()

	useEffect(() => {
		setRestaurantTables(currentValues => restaurantTables.length == 0 ? restaurantTablesFromAPI : currentValues)
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
