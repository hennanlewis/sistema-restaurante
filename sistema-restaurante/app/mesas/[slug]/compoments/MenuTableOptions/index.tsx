"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useBaseContext } from "@/contexts/MainContext"
import { sumArrayValues } from "@/utils/dataFormater"

import style from "./menutableoptions.module.css"
import { ModalImpress } from "../ModalImpress"

type MenuTableOptionsProps = {
    table: RestaurantTableData
}

export function MenuTableOptions({ table }: MenuTableOptionsProps) {
    const { orders, setOrders, restaurantTables, setRestaurantTables } = useBaseContext()
    const [showModal, setShowModal] = useState(false)
    const updatedProcessedOrders = JSON.stringify(orders
        .filter(item => item.isPlaced == true && table.name == item.tableID))

    const startTable = async () => {
        let updatedRestaurantTables = restaurantTables
            .map(item => item.name == table.name ?
                { ...item, customersQuantity: 1 } : item)

        const [{ _id: tableId }] = updatedRestaurantTables.filter(item => item.name == table.name)

        const result = await fetch("/api/mesas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tableId }),
        })

        if (result.ok) {
            const occupiedAt = await result.json()
            updatedRestaurantTables = updatedRestaurantTables
                .map(item => item.name == table.name ?
                    { ...item, occupiedAt } : item)
            setRestaurantTables(updatedRestaurantTables)
            return console.log("Mesa ocupada com sucesso!")
        }
        console.log("Erro ao ocupar mesa!")
    }

    const openModal = () => setShowModal(true)
    const closeModal = () => { setShowModal(false) }

    const processOrders = async () => {
        const ordersToProcess = orders
            .filter(item => item.tableID == table.name && item.isPlaced == false)
            .map(item => ({ ...item, isPlaced: true }))

        const response = await fetch("/api/pedidos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(ordersToProcess)
        })

        const processedOrders = await response.json()
        setOrders(processedOrders)

        closeModal()
    }

    const updateOrders = async () => {

        const response = await fetch("/api/pedidos")
        if(response.ok) {
            const updatedOrders = await response.json()
            setOrders(updatedOrders)
        }

    }

    useEffect(() => {
        const object: OrderData[] = JSON.parse(updatedProcessedOrders)
        const totalOrderPrice = sumArrayValues(object.map(item => item.dishPrice))
        const totalOrderItems = sumArrayValues(object.map(item => item.itemQuantity))

        setRestaurantTables(currentValues => currentValues
            .map(item => item.name == table.name ?
                { ...item, ordersTotalPrice: totalOrderPrice, ordersTotalQuantity: totalOrderItems }
                : item)
        )

        setOrders(currentValues => currentValues
            .map(order => ({ ...order, keyOrderID: order._id != "" ? order._id : order.keyOrderID  }))
        )
    }, [updatedProcessedOrders, setRestaurantTables])

    return (
        <div className={style.orderOptionsContent + "print:bg-white"}>
            <h2 className={style.contentTitle}>Mesa</h2>
            <div className={style.buttonOptions}>
                {!table.occupiedAt &&
                    <button onClick={startTable}>Ocupar mesa</button>
                }
                {table.occupiedAt && <>
                    <button onClick={openModal}>Imprimir pedidos</button>
                    <Link href={`/mesas/${table.name}/separar-cliente`}>
                        Separar por cliente
                    </Link>
                    <Link href={`/mesas/${table.name}/transferir`}>
                        Mudar mesa
                    </Link>
                    <button onClick={updateOrders}>Atualizar pedidos</button>
                </>}
            </div>
            {showModal &&
                <ModalImpress
                    closeModal={closeModal}
                    processOrders={processOrders}
                    tableName={table.name}
                />
            }
        </div>
    )
}