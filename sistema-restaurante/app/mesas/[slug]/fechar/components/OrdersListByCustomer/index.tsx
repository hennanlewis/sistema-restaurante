import { currencyFormater, showedOrdersFormater, sumArrayValues } from "@/utils/dataFormater"

import style from "./orderslistbycustomer.module.css"

type OrdersListByCustomerProps = {
	orders: OrderData[]
	label: string
}

export function OrdersListByCustomer({ orders, label }: OrdersListByCustomerProps) {
	const filteredOrders = showedOrdersFormater(orders)
	const totalPrice = sumArrayValues(orders.map(order=>order.price))
	return <>
		<h2 className={style.contentTitle}>{label}</h2>
		<div className={style.content}><ul>
			{filteredOrders.length > 0 && filteredOrders
				.map(item =>
					<li key={item.orderKey}>
						{item.itemQuantity}x {item.itemID} - {currencyFormater(totalPrice)}
					</li>
				)
			}
		</ul></div>
	</>
}