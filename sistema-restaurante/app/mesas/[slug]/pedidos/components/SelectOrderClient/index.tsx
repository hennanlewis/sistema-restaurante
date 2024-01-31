import { currencyFormater, formatOrderText, showedOrdersFormater } from "@/utils/dataFormater"

import style from "./selectorderclient.module.css"
import { ClientSelection } from "../ClientSelection"

type SelectOrderClientProps = {
	orders: OrderData[]
	label: string
	numberOfClients: number
}

export function SelectOrderClient({ orders, label, numberOfClients }: SelectOrderClientProps) {

	return <>
		<h2 className={style.contentTitle}>{label}</h2>
		<form className={style.content}>
			<div className={style.selection}>
				{orders.length > 0 && orders
					.map(item =>
						<div key={item.itemID + item.sectionName + item.clientNumber + item.tableID}>
							<ClientSelection numberOfClients={numberOfClients} orderKey={item.itemID + item.sectionName + item.clientNumber + item.tableID} />
                            <span>{formatOrderText(
                                item.itemQuantity,
                                item.dishName,
                                item.sectionName,
                                item.dishPrice
                            )}</span>
						</div>
					)
				}
			</div>
		</form>
	</>
}