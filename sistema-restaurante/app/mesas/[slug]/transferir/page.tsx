"use client"
import { useParams, useRouter } from "next/navigation"
import { useBaseContext } from "@/contexts/MainContext"

import TopInfo from "../compoments/TopInfo"
import style from "./transferir.module.css"

export default function TransferTable() {
    const params = useParams()
    const router = useRouter()
    const { orders, setOrders, restaurantTables, setRestaurantTables } = useBaseContext()

    const exchangeTable = (targetTable: string) => {
        const slug = String(params.slug)
        const targetOrders = orders.filter((item) => item.tableID === targetTable)
        const slugOrders = orders.filter((item) => item.tableID === slug)

        const updateOrderTableID = (order: OrderData) => {
            if (order.tableID === slug) return { ...order, tableID: targetTable }
            if (order.tableID === targetTable) return { ...order, tableID: slug }
            return order
        }

        setOrders((currentValues) => currentValues.map(updateOrderTableID))

        const exchangedTableWithIndex = restaurantTables
            .map((item, index) => (item.name === targetTable || item.name === slug ? { ...item, index } : { ...item, index: null }))
            .filter((item) => item.index !== null)

        if (exchangedTableWithIndex.length === 2) {
            const updateTableValues = (table: RestaurantTableData, index: number) => {
                const exchangedIndex0 = exchangedTableWithIndex[0].index
                const exchangedIndex1 = exchangedTableWithIndex[1].index

                if (index === exchangedIndex0 || index === exchangedIndex1) {
                    const exchangedTableIndex = index === exchangedIndex0 ? 1 : 0

                    table.ordersTotalPrice = exchangedTableWithIndex[exchangedTableIndex].ordersTotalPrice
                    table.ordersTotalQuantity = exchangedTableWithIndex[exchangedTableIndex].ordersTotalQuantity
                    table.customersQuantity = exchangedTableWithIndex[exchangedTableIndex].customersQuantity
                    table.occupiedAt = exchangedTableWithIndex[exchangedTableIndex].occupiedAt
                }

                return table
            }

            setRestaurantTables((currentValues) => currentValues.map(updateTableValues))
        }

        router.replace(`/mesas/${targetTable}`)
    }

    return (
        <main className={style.main}>
            <TopInfo />

            <div className={style.container}>
                <div className={style.orderOptionsContent}>
                    <h2 className={style.contentTitle}>Selecione a mesa</h2>
                    <div className={style.buttonOptions}>
                        {restaurantTables
                            .filter(table => table.name != params.slug)
                            .map(table =>
                                <button
                                    key={table.name}
                                    onClick={() => exchangeTable(table.name)}
                                >
                                    Mesa {table.name}
                                </button>
                            )
                        }
                    </div>
                </div>
            </div>
        </main >
    )
}
