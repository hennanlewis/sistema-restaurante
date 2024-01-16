"use client"
import { useParams } from "next/navigation"
import { useBaseContext } from "@/contexts/MainContext"

import { OrdersListByCustomer } from "./components/OrdersListByCustomer"
import TopInfo from "../compoments/TopInfo"
import style from "./fechar.module.css"

export default function CloseOrder() {
	const params = useParams()
	const { orders, restaurantTables } = useBaseContext()

	const [selectedTable] = restaurantTables.filter(table => table.customersQuantity)
	const ordersByCustomer = Array.from({ length: selectedTable.customersQuantity }, (_, index) => ++index)

	return (
		<main className={style.main}>
			<TopInfo hideCloseOrder />

			<div className={style.container}>
				<div className={style.orderOptionsContent}>
					<div className={style.ordersByCustomer}>
						{ordersByCustomer.map(customer => {
							const orderByCustomer = orders.filter(item => item.clientNumber == customer)
                            const key = JSON.stringify(customer)
							return <OrdersListByCustomer key={key} orders={orderByCustomer} label={` Cliente ${customer}`} />
						}
						)}
					</div>
				</div>
			</div>
		</main >
	)
}
