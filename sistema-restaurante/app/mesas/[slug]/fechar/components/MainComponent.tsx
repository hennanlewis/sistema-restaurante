"use client"
import { useParams } from "next/navigation"
import { useBaseContext } from "@/contexts/MainContext"

import style from "../close.module.css"
import TopInfo from "../../compoments/TopInfo"
import { ChangeEvent, useState } from "react"
import { showedOrdersFormater, sumArrayValues } from "@/utils/dataFormater"
import { OrdersByClientToImpress } from "./OrdersByClientToImpress"
import { AdditionalCharges } from "./AdditionalCharges"

type AdditionalChargeData = {
    text: string
    value: number
}

export function MainComponent() {
    const params = useParams()
    const { orders, setOrders, restaurantTables, setRestaurantTables, incrementalHexNumber } = useBaseContext()

    const [currentTable] = restaurantTables.filter(item => item.name == params.slug)

    const [selectedClient, setSelectedClient] = useState(0)
    const [discount, setDiscount] = useState(0)
    const [paymentMethod, setPaymentMethod] = useState("pix")
    const [paymentData, setPaymentData] = useState({
        orderIds: [],
        paymentMethod: "pix",
        discount: 0,
        serviceFee: 0,
        tableID: "",
    })

    const handleSelectedClient = (clientNumber: number) => {
        setSelectedClient(clientNumber)
    }

    const selectedClientOrders = showedOrdersFormater(orders)
        .filter(order => order.tableID == currentTable.name && order.clientNumber == selectedClient && order.isPlaced)
    const totalOrdersValue = sumArrayValues(selectedClientOrders.map(order => order.dishPrice * order.itemQuantity))

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
        setDiscount((totalOrdersValue + totalOrdersValue * 0.1) * 0.2)
    }

    const handleFinishOrders = async () => {
        const ordersToProcess = orders
            .filter(item => item.tableID == currentTable.name)

        const response = await fetch("/api/finalizar", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(ordersToProcess)
        })

        if (response.ok) {
            setOrders(orders.filter(item => item.tableID != currentTable.name))
        }
    }
    const handleSendPaymentData = async () => {
        const ordersToProcess = orders
            .filter(item => item.tableID === currentTable.name && item.clientNumber === selectedClient)

        const dataToSend = {
            orderIds: ordersToProcess.map(order => order._id),
            paymentMethod: paymentMethod,
            discount: discount,
            serviceFee: totalOrdersValue * 0.1,
            tableID: currentTable.name,
        }

        const response = await fetch("/api/finalizar", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataToSend),
        })

        if (response.ok) {
            setOrders(orders.filter(item => item.tableID !== currentTable.name))
            setSelectedClient(0)
            setDiscount(0)
        }
    }

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

            <div className={style.container}>
                <div className={style.content}>
                    <label className={style.inputLabel}>
                        Desconto:
                        <input type="number" onChange={handleDiscount} value={Number(discount)} min={0} />
                    </label>
                    <button className={style.buttonOptionsHalf} onClick={handleGive20Percent}>Calcular 20%</button>
                </div>
            </div>

            {selectedClient > 0 &&
                <div className={style.container}>
                    <div className={style.contentPrint}>
                        <OrdersByClientToImpress
                            selectedClientOrders={selectedClientOrders}
                            selectedClient={selectedClient}
                            text="Restaurante Sabor do Mar"
                            hideButton
                        />
                        <AdditionalCharges
                            additionalCharges={additionalCharges}
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
                                <option value="cartao">Cartão</option>
                            </select>
                        </label>
                        <button
                            className={style.buttonOptionsHalf}
                            onClick={handleSendPaymentData}
                        >
                            FINALIZAR PEDIDOS
                        </button>
                        <button className={style.buttonOptionsHalf} onClick={handleFinishOrders}>FECHAR MESA</button>
                    </div>
                </div>
            }
        </main >
    )
}
