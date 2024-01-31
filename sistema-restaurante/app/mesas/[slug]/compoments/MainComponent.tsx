"use client"
import { str2Slug } from "@/utils/dataFormater"
import { menuSections } from "@/utils/restaurant-menu"
import { useBaseContext } from "@/contexts/MainContext"

import style from "../mesas.module.css"
import TopInfo from "./TopInfo"
import { ShowOrders } from "./ShowOrders"
import { MenuTableOptions } from "./MenuTableOptions"
import { MenuOptions } from "./MenuOptions"

export function MainComponent({ itemsMenu, params }: { itemsMenu: MenuSection[], params: { slug: string } }) {
    const { ordersWithID, restaurantTables } = useBaseContext()
    console.log(ordersWithID)

    const [currentTable] = restaurantTables.filter(item => str2Slug(item.name) == params.slug)
    const filteredOrders = ordersWithID
        .filter(item => item.itemQuantity > 0 && item.tableID == currentTable.name)
    const processedOrders = filteredOrders.filter(item => item.isFinished == true)
    const waitingOrders = filteredOrders.filter(item => item.isFinished == false)

    return (
        <main className={style.main}>
            <TopInfo />

            <div className={style.container}>
                <MenuTableOptions table={currentTable} />
                {currentTable.occupiedAt && waitingOrders.length > 0 &&
                    <ShowOrders label="Pedidos pendentes" orders={waitingOrders} />}
                {currentTable.occupiedAt && processedOrders.length > 0 &&
                    <ShowOrders label="Pedidos realizados" orders={processedOrders} />}
                {currentTable.occupiedAt &&
                    <MenuOptions menuSections={itemsMenu} table={currentTable} />
                }
            </div>
        </main >
    )
}
