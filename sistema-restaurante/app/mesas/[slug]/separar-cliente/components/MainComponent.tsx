"use client"
import { useBaseContext } from "@/contexts/MainContext"

import style from "../groupedbycostumer.module.css"
import { useParams } from "next/navigation"
import TopInfo from "../../compoments/TopInfo"
import { formatOrderText } from "@/utils/dataFormater"
import { ChangeEvent, useRef } from "react"

export function MainComponent() {
    const params = useParams()
    const { orders, setOrders, restaurantTables, setRestaurantTables } = useBaseContext()

    const [currentTable] = restaurantTables.filter(item => item.name == params.slug)
    const filteredOrders = orders
        .filter(item => item.tableID == currentTable.name)
        .sort((a, b) => a.dishName < b.dishName ? -1 : 1)

    const handleDecreaseCustomers = () => {
        const updatedTable = restaurantTables.map(table => {
            return {
                ...table,
                customersQuantity: table.name == params.slug ?
                    Math.max(1, table.customersQuantity - 1) :
                    table.customersQuantity
            }
        })
        setRestaurantTables(updatedTable)
    }

    const handleIncreaseCustomers = async () => {
        const updatedTable = restaurantTables
            .map(table => {
                return {
                    ...table,
                    customersQuantity: table.name == params.slug ?
                        table.customersQuantity + 1 :
                        table.customersQuantity
                }
            })

        const [selectedTable] = updatedTable.filter(table => table.name == params.slug)
        const response = await fetch("/api/mesas", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(selectedTable)
        })

        if (response.ok)
            setRestaurantTables(updatedTable)

    }

    const handleCustomerChange = async (ID: string, event: ChangeEvent<HTMLSelectElement>) => {
        const clientNumber = Number(event.target.value)
        const [selectOrder] = filteredOrders.filter(order => order._id == ID)
            .map(order => ({ ...order, clientNumber }))
        const response = await fetch("/api/pedidos", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(selectOrder)
        })

        if (response.ok) {
            const updatedOrders = orders.map(order => order._id == selectOrder._id ?
                selectOrder : order)
            setOrders(updatedOrders)
        }

    }

    return (
        <main className={style.main}>
            <TopInfo hideCloseOrder={filteredOrders.some(order => order.clientNumber == 0)} />

            <div className={style.container}>
                <div className={style.content}>
                    <button className={style.buttonOptions} onClick={handleDecreaseCustomers}>
                        Diminuir número de clientes
                    </button>
                    <button className={style.buttonOptions} onClick={handleIncreaseCustomers}>
                        Aumentar número de clientes
                    </button>
                </div>
            </div>

            <div className={style.container}>
                <div className={style.content}>
                    {filteredOrders.map(order =>
                        <div className={style.selectCustomer} key={order.keyOrderID}>
                            <select
                                onChange={(event) => handleCustomerChange(order._id, event)}
                                value={order.clientNumber}
                            >
                                {order.clientNumber == 0 && <option value={0}> </option>}
                                {Array.from({ length: currentTable.customersQuantity }, (_, index) => ++index)
                                    .map((_, index) => (
                                        <option key={index} value={index + 1} onClick={() => console.log(index + 1)}>
                                            Cliente {index + 1}
                                        </option>
                                    ))}
                            </select>
                            {formatOrderText(order.itemQuantity, order.dishName, order.sectionName, order.dishPrice)}
                        </div>
                    )}
                </div>
            </div>

        </main >
    )
}
