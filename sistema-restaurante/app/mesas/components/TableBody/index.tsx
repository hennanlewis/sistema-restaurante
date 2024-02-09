"use client"
import { useBaseContext } from "@/contexts/MainContext"
import { TableItem } from "../TableItem"

import style from "./tablebody.module.css"

export function TableBody() {
    const { restaurantTables } = useBaseContext()

    return (
        <div className={style.listBody}>
            {restaurantTables.sort((a, b) => {
                let numA = parseInt(a.name)
                let numB = parseInt(b.name)

                if (!isNaN(numA) && !isNaN(numB)) return numA - numB
                if (!isNaN(numA)) return -1
                if (!isNaN(numB)) return 1
                if (a.name.startsWith('P') && b.name.startsWith('P')) {
                    numA = parseInt(a.name.slice(1))
                    numB = parseInt(b.name.slice(1))
                    return numA - numB
                }

                return a.name.localeCompare(b.name);
            }).map((tableInfo) =>
                <TableItem key={tableInfo.name} tableInfo={tableInfo} />)
            }
        </div>
    )
}
