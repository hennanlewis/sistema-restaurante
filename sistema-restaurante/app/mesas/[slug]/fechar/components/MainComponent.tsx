"use client"
import { useParams } from "next/navigation"
import { useBaseContext } from "@/contexts/MainContext"

import style from "../close.module.css"
import TopInfo from "../../compoments/TopInfo"
import { ChangeEvent, useEffect, useState } from "react"
import { currencyFormater, formatOrderText, showedOrdersFormater, sumArrayValues } from "@/utils/dataFormater"
import { OrdersByClientToImpress } from "./OrdersByClientToImpress"
import { AdditionalCharges } from "./AdditionalCharges"

type AdditionalChargeData = {
    text: string
    value: number
}

export function MainComponent() {
    const params = useParams()
    const { orders, setOrders, restaurantTables, setRestaurantTables } = useBaseContext()

    const [currentTable] = restaurantTables.filter(item => item.name == params.slug)

    const [selectedClient, setSelectedClient] = useState(0)
    const [discount, setDiscount] = useState(0)
    const [paymentMethod, setPaymentMethod] = useState("pix")
    const [paymentData, setPaymentData] = useState({
        orders: [] as OrderData[],
        paymentMethod: "pix",
        discount: 0,
        serviceFee: 0,
        tableID: "",
    })
    const [selectedReducedPriceId, setSelectedReducedPriceId] = useState("")
    const [selectedReducedPrice, setSelectedReducedPrice] = useState(0)

    const handleSelectedClient = (clientNumber: number) => {
        setSelectedClient(clientNumber)
    }

    const selectedClientOrders = orders
        .filter(order => order.tableID == currentTable.name && order.clientNumber == selectedClient && order.isPlaced)
        .sort((a, b) => a.dishName < b.dishName ? -1 : 1)
        .map(order => ({ ...order, dishPrice: order.dishPrice }))
    const totalOrdersValue = sumArrayValues(selectedClientOrders
        .map(order => (order.dishPrice - (order.reducedPrice || 0)) * order.itemQuantity))

    const additionalCharges: AdditionalChargeData[] = [
        {
            text: "Taxa de serviço",
            value: totalOrdersValue * 0.1
        },
        { text: "Desconto", value: -discount },
        { text: "Total", value: 1.1 * totalOrdersValue - discount }
    ]

    const handleDiscount = (event: ChangeEvent<HTMLInputElement>) => {
        setDiscount(Number(event.target.value))
    }

    const handleGive20Percent = () => {
        const totalOrdersValue = sumArrayValues(selectedClientOrders.map(order => order.dishPrice))
        const normalizedDiscount = ((totalOrdersValue + totalOrdersValue * 0.1) * 0.2).toFixed(2)
        setDiscount(Number(normalizedDiscount))
    }

    const handleFinishOrders = async () => {
        let [table] = restaurantTables.filter(item => item.name == params.slug)
        table = {
            ...table,
            ordersTotalPrice: 0,
            ordersTotalQuantity: 0,
            customersQuantity: 0,
            occupiedAt: null
        }

        const response = await fetch("/api/mesas", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(table)
        })

        if (response.ok) {
            const updatedTables = restaurantTables
                .map(item => item.name == table.name ? table : item)
            setRestaurantTables(updatedTables)
        }
    }

    const handleReducePrice = () => {
        const updatedOrders = orders.map(order => order._id == selectedReducedPriceId ?
            { ...order, reducedPrice: selectedReducedPrice } : order)
        setOrders(updatedOrders)
    }

    const handleSendPaymentData = async () => {
        const filteredOrders = orders
            .filter(item => item.tableID === currentTable.name && item.clientNumber === selectedClient)
        const filteredIds = filteredOrders.map(order => order._id)
        const ordersToProcess = showedOrdersFormater(filteredOrders)

        const tagData = {
            orders: ordersToProcess,
            paymentMethod: paymentMethod,
            discount: discount,
            serviceFee: Number((totalOrdersValue * 0.1).toFixed(2)),
            tableID: currentTable.name,
        }

        const response = await fetch("/api/finalizar", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(filteredIds),
        })

        if (response.ok) {
            setPaymentData(tagData)
            setOrders(orders.filter(item => !filteredIds.includes(item._id)))
            setSelectedClient(0)

            const response = await fetch("/api/finalizar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(tagData),
            })

        }
    }

    useEffect(() => { handleGive20Percent() }, [selectedClient])

    return (
        <main className={style.main}>
            <TopInfo hideCloseOrder />

            <div className={style.container}>
                <div className={style.content}>
                    {Array.from({ length: currentTable.customersQuantity }, (_, index) => ++index).map((_, index) =>
                        <button
                            key={currentTable._id + index}
                            className={style.buttonOptionsHalf}
                            onClick={() => handleSelectedClient(index + 1)}
                        >
                            Cliente {index + 1}
                        </button>
                    )}
                </div>
            </div>

            {selectedClient > 0 &&
                <div className={style.container}>
                    <div className={style.contentPrint}>
                        <OrdersByClientToImpress
                            selectedClientOrders={selectedClientOrders}
                            selectedClient={selectedClient}
                            text="Abater valores"
                            type="reduced price"
                        />

                        <label className={style.inputLabel}>
                            <select onChange={(e) => setSelectedReducedPriceId(e.target.value)}>
                                <option value=""> </option>
                                {selectedClientOrders.map(order =>
                                    <option key={order._id + "reducePrice"} value={order._id}>
                                        {formatOrderText(
                                            order.itemQuantity,
                                            order.dishName,
                                            order.sectionName,
                                            order.info
                                        )} {currencyFormater(order.reducedPrice || 0)}
                                    </option>
                                )}
                            </select>
                        </label>

                        {selectedReducedPriceId != "" &&
                            <label className={style.inputLabel}>
                                <input type="number" value={selectedReducedPrice}
                                    onChange={(e) => setSelectedReducedPrice(Number(e.target.value))} min={0}
                                />
                            </label>
                        }

                        {selectedReducedPriceId != "" &&
                            <button className={style.buttonOptions} onClick={handleReducePrice}>
                                Atualizar abatimento
                            </button>
                        }

                        <label className={style.inputLabel}>
                            Desconto final:
                            <input type="number" onChange={handleDiscount} value={Number(discount)} min={0} />
                        </label>
                        <button className={style.buttonOptions} onClick={handleGive20Percent}>Calcular 20%</button>
                    </div>
                </div>
            }

            {selectedClient > 0 &&
                <div className={style.containerPrint}>
                    <div className={style.contentPrint}>
                        <OrdersByClientToImpress
                            selectedClientOrders={showedOrdersFormater(selectedClientOrders)}
                            selectedClient={selectedClient}
                            text="Restaurante Sabor do Mar"
                            type="final price"
                            cupom={true}
                        />
                        <AdditionalCharges
                            additionalCharges={additionalCharges}
                            hasDate={true}
                        />
                    </div>
                </div>
            }

            {selectedClient > 0 &&
                <div className={style.container}>
                    <div className={style.content}>
                        <label className={style.inputLabel}>
                            Método de Pagamento:
                            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                                <option value="pix">PIX</option>
                                <option value="dinheiro">Dinheiro</option>
                                <option value="crédito">Cartão de crédito</option>
                                <option value="débito">Cartão de débito</option>
                            </select>
                        </label>
                        <button
                            className={style.buttonOptions}
                            onClick={handleSendPaymentData}
                        >
                            FINALIZAR PEDIDO (Cliente {selectedClient})
                        </button>
                    </div>

                    <div className={style.content}>
                        <button className={style.buttonOptions} onClick={handleFinishOrders}>FECHAR MESA</button>
                    </div>
                </div>
            }
        </main >
    )
}
