import { IoPeople } from "react-icons/io5"
import { MdChecklist } from "react-icons/md"
import Link from "next/link"

import style from "./tableitem.module.css"
import { ElapsedTimer } from "../ElapserTime"
import { currencyFormater } from "@/utils/dataFormater"

import "@/app/globals.css"

type TableBodyItemProps = {
	tableInfo: RestaurantTableData
}

export function TableItem({ tableInfo }: TableBodyItemProps) {
	const { name, ordersTotalPrice, ordersTotalQuantity, customersQuantity, occupiedAt } = tableInfo
	const url = "/mesas/" + name.toLocaleLowerCase().replace(" ", "_")

	return (
		<Link href={url}>
			<div className={occupiedAt ? style.listItem : style.listItemEmpty}>
				<span>{name}</span>
				<span>{currencyFormater(ordersTotalPrice)}</span>
				<span>{ordersTotalQuantity} <MdChecklist /> </span>
				<span>{customersQuantity} <IoPeople /></span>
				{occupiedAt && <ElapsedTimer occupiedAt={occupiedAt} />}
				{!occupiedAt && <span>Livre</span>}
			</div>
		</Link>
	)
}
