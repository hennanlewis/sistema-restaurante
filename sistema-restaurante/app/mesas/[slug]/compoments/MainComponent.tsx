"use client"
import { useParams } from "next/navigation"
import { useBaseContext } from "@/contexts/MainContext"

import style from "../mesas.module.css"
import { ShowOrders } from "./ShowOrders"
import { MenuTableOptions } from "./MenuTableOptions"
import { MenuOptions } from "./MenuOptions"
import TopInfo from "./TopInfo"
import { ChangeEvent, useState } from "react"

export function MainComponent({ itemsMenu }: { itemsMenu: MenuSection[] }) {
    const params = useParams()
    const { orders, setOrders, restaurantTables } = useBaseContext()

    const [currentTable] = restaurantTables.filter(item => item.name == params.slug)
    const filteredOrders = orders
        .filter(item => item.tableID == currentTable.name)
    const processedOrders = filteredOrders.filter(item => item.isPlaced == true)
    const waitingOrders = filteredOrders.filter(item => item.isPlaced == false)
    const [deleteItemID, setDeleteItemID] = useState("")
    const [deleteItem, setDeleteItem] = useState(false)

    const deleteOrder = () => {
        setDeleteItem(!deleteItem)
    }

    const selectItem = (event: ChangeEvent<HTMLSelectElement>) => {
        setDeleteItemID(event.target.value)
    }

    const deleteConfirm = async () => {
        const response = await fetch("/api/pedidos", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ _id: deleteItemID })
        })
        if (response.ok)
            setOrders(orders.filter(item => item._id != deleteItemID))
        setDeleteItem(!deleteItem)
    }

    return (
        <main className={style.main}>
            <TopInfo hideCloseOrder />

            <div className={style.container}>
                <MenuTableOptions table={currentTable} />
                {currentTable.occupiedAt && waitingOrders.length > 0 &&
                    <ShowOrders label="Pedidos pendentes" orders={waitingOrders} showAddInfo />}
                {currentTable.occupiedAt && processedOrders.length > 0 &&
                    <>
                        <ShowOrders label="Pedidos realizados" orders={processedOrders} showAddInfo />
                        {deleteItem &&
                            <>
                                <select
                                    className={style.select}
                                    onChange={(e) => selectItem(e)}
                                >
                                    {processedOrders.map((item, index) =>
                                        <option key={index} value={item.keyOrderID}>
                                            {item.itemQuantity}x {item.dishName} {item.info ? `(${item.info})` : ""}
                                        </option>
                                    )}
                                </select>
                                <button onClick={deleteConfirm} className={style.buttonOptions}>
                                    Confirmar exclusão
                                </button>
                            </>
                        }

                        {!deleteItem && <button onClick={deleteOrder} className={style.buttonOptions}>
                            Excluir pedido
                        </button>}

                    </>
                }

                {currentTable.occupiedAt &&
                    <MenuOptions menuSections={itemsMenu} table={currentTable} />
                }
            </div>
        </main >
    )
}
