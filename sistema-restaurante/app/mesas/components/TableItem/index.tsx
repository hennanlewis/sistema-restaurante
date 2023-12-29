import { IoPeople } from "react-icons/io5"
import { MdChecklist } from "react-icons/md"
import Link from "next/link"

import style from "./tableitem.module.css"
import { ElapsedTimer } from "../ElapserTime"
import { currencyFormater } from "@/utils/dataFormater"

import "@/app/globals.css"
import { useBaseContext } from "@/contexts/MainContext"
import { hasAdminPermission } from "@/utils/testPermissions"

type TableBodyItemProps = {
	tableInfo: RestaurantTableData
}

export function TableItem({ tableInfo }: TableBodyItemProps) {
	const { user } = useBaseContext()
	const { name, ordersTotalPrice, ordersTotalQuantity, customersQuantity, occupiedAt } = tableInfo
	const url = "/mesas/" + name.toLocaleLowerCase().replace(" ", "_")

	const itemClass = () => {
		if(user && hasAdminPermission(user.role)) return style.listItem2
		return style.listItem
	}

	return (
		<Link href={url}>
			<div className={itemClass()}>
				<span>{name}</span>
				{user && hasAdminPermission(user.role) && <span>{currencyFormater(ordersTotalPrice)}</span>}
				<span>{ordersTotalQuantity} <MdChecklist /> </span>
				<span>{customersQuantity} <IoPeople /></span>
				{occupiedAt && <ElapsedTimer occupiedAt={occupiedAt} />}
				{!occupiedAt && <span className={style.listFreeTable}>Livre</span>}
			</div>
		</Link>
	)
}
