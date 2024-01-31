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
    const { orders, setOrders, setRestaurantTables } = useBaseContext()
    const [showModal, setShowModal] = useState(false)
    const updatedProcessedOrders = JSON.stringify(orders
        .filter(item => item.isFinished == true && table.name == item.tableID))

    const startTable = () => {
        setRestaurantTables(currentValues => {
            const newValues = currentValues.map(values =>
                values.name == table.name ?
                    { ...values, occupiedAt: new Date(), customersQuantity: 1 }
                    :
                    values)
            return newValues
        })
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