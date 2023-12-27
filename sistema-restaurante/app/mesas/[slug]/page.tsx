"use client"
import { str2Slug } from "@/utils/dataFormater"
import { menuSections } from "@/utils/restaurant-menu"
import { useTableContext } from "@/contexts/TableContext"


import { ShowOrders } from "./compoments/ShowOrders"
import { MenuOptions } from "./compoments/MenuOptions"
import { MenuTableOptions } from "./compoments/MenuTableOptions"
import TopInfo from "./compoments/TopInfo"
import style from "./mesas.module.css"

export default function Mesas({ params }: { params: { slug: string } }) {
	const { orders, restaurantTables } = useTableContext()

	const [currentTable] = restaurantTables.filter(item => str2Slug(item.name) == params.slug)
	const filteredOrders = orders
		.filter(item => item.itemQuantity > 0 && item.tableID == currentTable.name)
	const processedOrders = filteredOrders.filter(item => item.isFinished == true)
	const waitingOrders = filteredOrders.filter(item => item.isFinished == false)

	return (
		<main className={style.main}>
			<TopInfo />

			<div className={style.container}>
				<MenuTableOptions table={currentTable} />
				{currentTable.occupiedAt && waitingOrders.length > 0 &&
					<ShowOrders label="Pedidos pendentes" orders={waitingOrders} />}
				{currentTable.occupiedAt && processedOrders.length > 0 &&
					<ShowOrders label="Pedidos processados" orders={processedOrders} />}
				{currentTable.occupiedAt &&
					<MenuOptions menuSections={menuSections} table={currentTable} />
				}
			</div>
		</main >
	)
}
