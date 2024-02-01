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
        .filter(item => item.isFinished == true && table.name == item.tableID))

    const startTable = async () => {
        let updatedRestaurantTables = restaurantTables
            .map(item => item.name == table.name ?
                { ...item, customersQuantity: 1 } : item)

        const [{ _id: tableId }] = updatedRestaurantTables.filter(item => item.name == table.name)

        const result = await fetch("/api/mesas", {
            method: "PUT",
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

    const processOrders = () => {
        setOrders(currentValues => currentValues
            .map(item => item.tableID == table.name ?
                { ...item, isFinished: true }
                :
                item
            )
        )

        closeModal()
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
    }, [updatedProcessedOrders, setRestaurantTables])

    return (
        <div className={style.orderOptionsContent}>
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