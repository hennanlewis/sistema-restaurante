"use client"
import { useBaseContext } from "@/contexts/MainContext"

import style from "../groupedbycostumer.module.css"
import { useParams } from "next/navigation"
import TopInfo from "../../compoments/TopInfo"

export function MainComponent() {
    const params = useParams()
    const { orders, restaurantTables } = useBaseContext()

    const [currentTable] = restaurantTables.filter(item => item.name == params.slug)
    const filteredOrders = orders
        .filter(item => item.itemQuantity > 0 && item.tableID == currentTable.name)

    return (
        <main className={style.main}>
            <TopInfo />

            <div className={style.container}>
            </div>
        </main >
    )
}
