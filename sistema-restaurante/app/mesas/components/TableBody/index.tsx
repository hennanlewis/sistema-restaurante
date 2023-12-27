"use client"
import { useBaseContext } from "@/contexts/MainContext"
import { TableItem } from "../TableItem"

import style from "./tablebody.module.css"

export function TableBody() {
	const { restaurantTables } = useBaseContext()

	return (
		<div className={style.listBody}>
			{restaurantTables.map((tableInfo) =>
				<TableItem key={tableInfo.name} tableInfo={tableInfo}/>)
			}
		</div>
	)
}
