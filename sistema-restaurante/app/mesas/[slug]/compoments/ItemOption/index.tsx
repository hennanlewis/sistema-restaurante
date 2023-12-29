import { ImMinus, ImPlus } from "react-icons/im"
import { currencyFormater } from "@/utils/dataFormater"

import style from "./itemoption.module.css"
import { useBaseContext } from "@/contexts/MainContext"

type MenuItemProps = SizeItemMenu & {
	optionName: string
	tableID: string
}

export function ItemOption({ optionName, price, tableID, type }: MenuItemProps) {
	const { orders, setOrders, user } = useBaseContext()
	const currentID = `${optionName} ${type}`.trim()
	const itemQuantity = orders
		.filter((item) =>
			currentID == item.itemID &&
			item.tableID === tableID &&
			item.isFinished == false
		).length

	const updateDecrease = () => {
		const itemIndex = orders
			.findIndex((item) =>
				item.tableID === tableID &&
				item.itemID === currentID &&
				item.isFinished == false
			)

		if (itemIndex != -1) {
			setOrders(currentValues =>
				currentValues.filter((_, index) => index != itemIndex)
			)
		}
	}

	const updateIncrease = () => {
		const itemToAdd: OrderData = {
			orderKey: String(new Date()) + Math.random(),
			itemID: currentID,
			itemQuantity: 1,
			clientNumber: 1,
			tableID,
			price,
			isFinished: false,
			staffUser: user?.username!
		}

		setOrders(currentValues => [...currentValues, itemToAdd])
	}

	return (
		<div className={style.orderItem}>
			<span className={style.buttons}>
				<button onClick={updateDecrease}><ImMinus /></button>
				<button onClick={updateIncrease}><ImPlus /></button>
			</span>
			<span>{itemQuantity}x {optionName} {type} {currencyFormater(price)}</span>
		</div>
	)
}
