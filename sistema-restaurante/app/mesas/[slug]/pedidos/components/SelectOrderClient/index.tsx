import { currencyFormater, showedOrdersFormater } from "@/utils/dataFormater"

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
						<div key={item.orderKey}>
							<ClientSelection numberOfClients={numberOfClients} orderKey={item.orderKey} />
							<span>{item.itemQuantity}x {item.itemID} - {currencyFormater(item.price)}</span>
						</div>
					)
				}
			</div>
		</form>
	</>
}