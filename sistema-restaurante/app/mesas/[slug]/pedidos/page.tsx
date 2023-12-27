"use client"
import { str2Slug } from "@/utils/dataFormater"
import { useTableContext } from "@/contexts/TableContext"

import { MenuClientsOptions } from "./components/MenuClientOptions"
import { SelectOrderClient } from "./components/SelectOrderClient"
import TopInfo from "../compoments/TopInfo"
import style from "./pedidos.module.css"

export default function OrderForClient({ params }: { params: { slug: string } }) {
	const { orders, restaurantTables } = useTableContext()

	const [currentTable] = restaurantTables.filter(item => str2Slug(item.name) == params.slug)
	const filteredOrders = orders
		.filter(item => item.itemQuantity > 0 && item.tableID == currentTable.name)
	const processedOrders = filteredOrders.filter(item => item.isFinished == true)
	const customersQuantity = currentTable.customersQuantity

	return (
		<main className={style.main}>
			<TopInfo />

			<div className={style.container}>
				<MenuClientsOptions table={currentTable} />

				<SelectOrderClient
					label="Pedidos processados"
					numberOfClients={customersQuantity}
					orders={processedOrders}
				/>
			</div>
		</main >
	)
}
