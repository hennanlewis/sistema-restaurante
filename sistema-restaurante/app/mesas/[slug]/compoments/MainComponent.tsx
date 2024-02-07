"use client"
import { useParams } from "next/navigation"
import { useBaseContext } from "@/contexts/MainContext"

import style from "../mesas.module.css"
import { ShowOrders } from "./ShowOrders"
import { MenuTableOptions } from "./MenuTableOptions"
import { MenuOptions } from "./MenuOptions"
import TopInfo from "./TopInfo"

export function MainComponent({ itemsMenu }: { itemsMenu: MenuSection[]}) {
    const params = useParams()
    const { orders, restaurantTables } = useBaseContext()

    const [currentTable] = restaurantTables.filter(item => item.name == params.slug)
    const filteredOrders = orders
        .filter(item => item.tableID == currentTable.name)
    const processedOrders = filteredOrders.filter(item => item.isPlaced == true)
    const waitingOrders = filteredOrders.filter(item => item.isPlaced == false)

    return (
        <main className={style.main}>
            <TopInfo hideCloseOrder />

            <div className={style.container}>
                <MenuTableOptions table={currentTable} />
                {currentTable.occupiedAt && waitingOrders.length > 0 &&
                    <ShowOrders label="Pedidos pendentes" orders={waitingOrders} showAddInfo />}
                {currentTable.occupiedAt && processedOrders.length > 0 &&
                    <ShowOrders label="Pedidos realizados" orders={processedOrders} showAddInfo />}

                {currentTable.occupiedAt &&
                    <MenuOptions menuSections={itemsMenu} table={currentTable} />
                }
            </div>
        </main >
    )
}
