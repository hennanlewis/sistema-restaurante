import { currencyFormater, showedOrdersFormater } from "@/utils/dataFormater"

import style from "../../mesas.module.css"

type ShowOrdersProps = {
	orders: OrderData[]
	label: string
}

export function ShowOrders({ orders, label }: ShowOrdersProps) {
	const filteredOrders = showedOrdersFormater(orders)
	return <>
		<h2 className={style.contentTitle}>{label}</h2>
		<div className={style.content}><ul>
			{filteredOrders.length > 0 && filteredOrders
				.map(item =>
					<li key={item.orderKey}>
						{item.itemQuantity}x {item.itemID} - {currencyFormater(item.price)}
					</li>
				)
			}
		</ul></div>
	</>
}