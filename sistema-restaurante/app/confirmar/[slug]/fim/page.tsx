"use client"
import { useBaseContext } from "@/contexts/MainContext"
import { currencyFormater, formatOrderText, showedOrdersFormater, sumArrayValues } from "@/utils/dataFormater"
import { useParams, useRouter } from "next/navigation"

import style from "./pedido.module.css"
import { MutableRefObject, useRef, useState } from "react"
import html2canvas from "html2canvas"

type AdditionalChargeData = {
    text: string
    value: number
}

export default function ConfirmOrders({
    searchParams,
}: {
    searchParams: { [key: string]: number | undefined }
}) {
    const { orders, restaurantTables } = useBaseContext()
    const params = useParams()
    const noteRef = useRef(null)
    const router = useRouter()
    const routerBack = () => router.back()

    const discount = - Number(searchParams.discount) || 0
    const selectedClient = searchParams.selectedClient || 0

    const [loading, setLoading] = useState(false)

    const [currentTable] = restaurantTables.filter(item => item.name == params.slug)
    const filteredOrders = orders
        .filter(item => item.itemQuantity > 0 && item.tableID == currentTable.name)

    const allClientsOrders = orders
        .filter(order => selectedClient == 0 ?
            order.tableID == currentTable.name && order.isPlaced :
            order.tableID == currentTable.name && order.isPlaced && order.clientNumber == selectedClient)
        .sort((a, b) => a.dishName < b.dishName ? -1 : 1)
        .map(order => ({ ...order, dishPrice: order.dishPrice }))

    const selectedClientOrders = showedOrdersFormater(allClientsOrders)

    const totalOrdersValue = sumArrayValues(allClientsOrders
        .map(order => (order.dishPrice - (order.reducedPrice || 0)) * order.itemQuantity))

    const additionalCharges: AdditionalChargeData[] = [
        {
            text: "Taxa de serviço",
            value: totalOrdersValue * 0.1
        },
        { text: "Desconto", value: - discount },
        { text: "Total", value: 1.1 * totalOrdersValue - discount }
    ]

    const sendImageToServer = async (imageData: string) => {
        try {
            await fetch("/api/imagem", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(imageData),
            })
            console.log("Image sent successfully!")
        } catch (error) {
            console.error("Error sending image:", error)
        }
    }

    const capturePageImage = (local: MutableRefObject<null>) => {
        setLoading(true)
        if (local.current) {
            html2canvas(local.current)
                .then(canvas => {
                    const image = canvas.toDataURL("image/png")
                    sendImageToServer(image)
                })
                .finally(() => setLoading(false))
        }
    }

    const printOrders = () => {
        if (filteredOrders.length > 0) capturePageImage(noteRef)
    }

    return <main className={style.main}>
        <div>
            <ul className={style.list} ref={noteRef}>
                <li className={style.logoImg}>
                    <img src="/logo.png" alt="" /></li>
                <li className={style.listTitle}>Restaurante Sabor do Mar</li>
                <li className={style.listItemCenter}>Avenida Beira Mar, 0</li>
                <li className={style.listItemCenter}>Vila Preá, Cruz/CE</li>
                <li className={style.listItemCenter}>CEP: 62595000</li>
                <li className={style.splitterDashTop}> </li>
                <li className={style.splitterHeader}>
                    <span>Produto</span>
                    <span>Valor</span>
                </li>
                <li className={style.splitterDashBottom}> </li>

                {selectedClientOrders.map(order =>
                    <li key={"fechar client" + order._id}>
                        <span>{formatOrderText(
                            order.itemQuantity,
                            order.dishName,
                            order.sectionName,
                            order.info
                        )}</span>
                        <span className={style.dots}></span>
                        <span className={style.dots}></span>
                        <span className={style.price}>
                            {currencyFormater((order.dishPrice) * order.itemQuantity - (order.reducedPrice || 0))}
                        </span>
                    </li>
                )}

                {additionalCharges.map((charge, index) =>
                    charge.text == "Desconto" && charge.value == 0 ? "" :
                        <li key={"taxas-adicionais" + index}>
                            <span>{charge.text}</span>
                            <span className={style.dots}></span>
                            <span className={style.dots}></span>
                            <span>{currencyFormater(charge.value)}</span>
                        </li>
                )}

                <li className={style.splitterDashTop}> </li>
                <li className={style.date}>
                    <span>Data: </span>
                    <span>
                        {new Intl.DateTimeFormat("pt-BR", {}).format(Date.now())}
                    </span>
                    <span>
                        {new Intl.DateTimeFormat("pt-BR", {
                            hour: "numeric",
                            minute: "numeric",
                            second: "numeric"
                        }).format(Date.now())}
                    </span>
                </li>
                <li className={style.splitterDashBottom}> </li>
            </ul>
            <div className={loading ? style.buttonLoading : style.buttonOptions}>
                <button onClick={printOrders}>Imprimir nota</button>
                <button onClick={routerBack}>Voltar</button>
            </div>
        </div>
    </main>
}
