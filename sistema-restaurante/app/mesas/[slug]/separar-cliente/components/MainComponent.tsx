"use client"
import { useBaseContext } from "@/contexts/MainContext"

import style from "../groupedbycostumer.module.css"
import { useParams } from "next/navigation"
import TopInfo from "../../compoments/TopInfo"
import { formatOrderText } from "@/utils/dataFormater"
import { ChangeEvent } from "react"

export function MainComponent() {
    const params = useParams()
    const { orders, setOrders, restaurantTables, setRestaurantTables } = useBaseContext()

    const [currentTable] = restaurantTables.filter(item => item.name == params.slug)
    const filteredOrders = orders
        .filter(item => item.itemQuantity > 0 && item.tableID == currentTable.name)
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

    const handleIncreaseCustomers = () => {
        const updatedTable = restaurantTables
            .map(table => {
                return {
                    ...table,
                    customersQuantity: table.name == params.slug ?
                        table.customersQuantity + 1 :
                        table.customersQuantity
                }
            })
        setRestaurantTables(updatedTable)
    }

    const handleCustomerChange = async (keyOrderID: string, event: ChangeEvent<HTMLSelectElement>) => {
        const clientNumber = Number(event.target.value)
        const [filteredOrder] = orders.filter(order => order.keyOrderID == keyOrderID)
            .map(order => ({ ...order, clientNumber }))
        const response = await fetch("/api/pedidos", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(filteredOrder)
        })

        if (response.ok) {
            const updatedOrders = orders.map(order => {
                return {
                    ...order,
                    clientNumber: order.keyOrderID == keyOrderID ?
                        clientNumber :
                        order.clientNumber
                }
            })
            setOrders(updatedOrders)
        }

    }

    return (
        <main className={style.main}>
            <TopInfo />

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
                                value={order.clientNumber}
                                onChange={(event) => handleCustomerChange(order.keyOrderID, event)}
                            >
                                {Array.from({ length: currentTable.customersQuantity }, (_, index) => ++index)
                                    .map((_, index) => (
                                        <option key={index} value={index + 1}>
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
