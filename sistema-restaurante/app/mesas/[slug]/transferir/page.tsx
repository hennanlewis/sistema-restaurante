"use client"
import { useParams } from "next/navigation"
import { useBaseContext } from "@/contexts/MainContext"

import TopInfo from "../compoments/TopInfo"
import style from "./transferir.module.css"

export default function TransferTable() {
	const params = useParams()
	const { orders, setOrders, restaurantTables, setRestaurantTables } = useBaseContext()

	const exchangeTable = (targetTable: string) => {
		const slug = String(params.slug)
		const targetOrders = orders.filter(item => item.tableID == targetTable)
		const slugOrders = orders.filter(item => item.tableID == slug)

		setOrders(caurrentValues => caurrentValues.map(order => {
			if (order.tableID == slug)
				return { ...order, tableID: targetTable }
			if (order.tableID == targetTable)
				return { ...order, tableID: slug }
			return order
		}))

		const exchangedTableWithIndex = restaurantTables
			.map((item, index) => item.name == targetTable || item.name == slug ?
				{ ...item, index } : { ...item, index: null }
			).filter(item => item.index != null)

		if (exchangedTableWithIndex.length == 2)
			setRestaurantTables(currentValues => currentValues.map((table, index) => {
				if(index == exchangedTableWithIndex[0].index) {
					table.ordersTotalPrice = exchangedTableWithIndex[1].ordersTotalPrice
					table.ordersTotalQuantity = exchangedTableWithIndex[1].ordersTotalQuantity
					table.customersQuantity = exchangedTableWithIndex[1].customersQuantity
					table.occupiedAt = exchangedTableWithIndex[1].occupiedAt
				}

				if (index == exchangedTableWithIndex[1].index) {
					table.ordersTotalPrice = exchangedTableWithIndex[0].ordersTotalPrice
					table.ordersTotalQuantity = exchangedTableWithIndex[0].ordersTotalQuantity
					table.customersQuantity = exchangedTableWithIndex[0].customersQuantity
					table.occupiedAt = exchangedTableWithIndex[0].occupiedAt
				}

				return table
			}))
	}

	return (
		<main className={style.main}>
			<TopInfo />

			<div className={style.container}>
				<div className={style.orderOptionsContent}>
					<h2 className={style.contentTitle}>Selecione a mesa</h2>
					<div className={style.buttonOptions}>
						{restaurantTables
							.filter(table => table.name != params.slug)
							.map(table =>
								<button
									key={table.name}
									onClick={() => exchangeTable(table.name)}
								>
									Mesa {table.name}
								</button>
							)}
					</div>
					{ }
				</div>
			</div>
		</main >
	)
}
