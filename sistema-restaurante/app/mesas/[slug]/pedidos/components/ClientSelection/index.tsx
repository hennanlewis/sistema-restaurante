import { ChangeEvent } from "react"

import style from "./clientselection.module.css"
import { useBaseContext } from "@/contexts/MainContext"

type ClientSelectionProps = {
	numberOfClients: number
	orderKey: string
}

export function ClientSelection({ numberOfClients, orderKey }: ClientSelectionProps) {
	const { orders, setOrders } = useBaseContext()

	const clientsNumber = Array.from({ length: numberOfClients }, (_, index) => ++index)
    const [selectedOrder] = orders.filter(order => order.itemID + order.sectionName + order.clientNumber + order.tableID == orderKey)

	const seletOrderClient = (event: ChangeEvent<HTMLSelectElement>) => {
		const selectedClientOption = Number(event.currentTarget.value)
		selectedOrder.clientNumber = selectedClientOption
		setOrders(currentValues => currentValues
            .map(item => item.itemID + item.sectionName + item.clientNumber + item.tableID == orderKey ? { ...item, clientNumber: selectedClientOption } : item)
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