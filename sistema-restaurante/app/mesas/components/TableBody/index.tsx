"use client"
import { useTableContext } from "@/contexts/TableContext"
import { TableItem } from "../TableItem"

import style from "./tablebody.module.css"

export function TableBody() {
	const { restaurantTables } = useTableContext()

	return (
		<div className={style.listBody}>
			{restaurantTables.map((tableInfo) =>
				<TableItem key={tableInfo.name} tableInfo={tableInfo}/>)
			}
		</div>
	)
}
