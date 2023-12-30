"use client"
import Link from "next/link"
import { useEffect } from "react"
import { useBaseContext } from "@/contexts/MainContext"
import { sumArrayValues } from "@/utils/dataFormater"

import style from "./menutableoptions.module.css"
import RestaurantTables from "@/app/mesas/page"

type MenuTableOptionsProps = {
	table: RestaurantTableData
}

export function MenuTableOptions({ table }: MenuTableOptionsProps) {
	const { orders, setOrders,restaurantTables, setRestaurantTables } = useBaseContext()
	const updatedProcessedOrders = JSON.stringify(orders
		.filter(item => item.isFinished == true && table.name == item.tableID))

	const startTable = () => {
		setRestaurantTables(currentValues => {
			const newValues = currentValues.map(values =>
				values.name == table.name ?
					{ ...values, occupiedAt: new Date(), customersQuantity: 1 }
					:
					values)
			return newValues
		})
	}

	const processOrders = () => {
		setOrders(currentValues => currentValues
			.map(item => item.tableID == table.name ?
				{ ...item, isFinished: true }
				:
				item
			)
		)
	}

	useEffect(() => {
		const object: OrderData[] = JSON.parse(updatedProcessedOrders)
		const totalOrderPrice = sumArrayValues(object.map(item => item.price))
		const totalOrderItems = sumArrayValues(object.map(item => item.itemQuantity))

		setRestaurantTables(currentValues => currentValues
			.map(item => item.name == table.name ?
				{ ...item, ordersTotalPrice: totalOrderPrice, ordersTotalQuantity: totalOrderItems }
				: item)
		)
	}, [updatedProcessedOrders])

	return (
		<div className={style.orderOptionsContent}>
			<h2 className={style.contentTitle}>Mesa</h2>
			<div className={style.buttonOptions}>
				{!table.occupiedAt &&
					<button onClick={startTable}>Ocupar mesa</button>
				}
				{table.occupiedAt && <>
					<button onClick={processOrders}>Imprimir pedidos</button>
					<Link href={`/mesas/${table.name}/pedidos`}>
						Separar por cliente
					</Link>
					<Link href={`/mesas/${table.name}/transferir`}>
						Mudar mesa
					</Link>
				</>}
			</div>
		</div>
	)
}