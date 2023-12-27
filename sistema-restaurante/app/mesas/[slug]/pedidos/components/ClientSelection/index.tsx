import { ChangeEvent } from "react"

import style from "./clientselection.module.css"
import { useTableContext } from "@/contexts/TableContext"

type ClientSelectionProps = {
	numberOfClients: number
	orderKey: string
}

export function ClientSelection({ numberOfClients, orderKey }: ClientSelectionProps) {
	const { orders, setOrders } = useTableContext()

	const clientsNumber = Array.from({ length: numberOfClients }, (_, index) => ++index)
	const [selectedOrder] = orders.filter(order => order.orderKey == orderKey)

	const seletOrderClient = (event: ChangeEvent<HTMLSelectElement>) => {
		const selectedClientOption = Number(event.currentTarget.value)
		selectedOrder.clientNumber = selectedClientOption
		setOrders(currentValues => currentValues
			.map(item => item.orderKey == orderKey ? { ...item, clientNumber: selectedClientOption } : item)
		)
	}

	return (
		<select onChange={seletOrderClient} className={style.select} value={selectedOrder.clientNumber}>
			{clientsNumber.map(clientNumber => {
				return (
					<option key={clientNumber + orderKey} value={clientNumber}>
						Cliente {clientNumber}
					</option>
				)
			})}
		</select>
	)
}