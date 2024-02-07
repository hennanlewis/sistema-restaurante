"use client"
import { useBaseContext } from "@/contexts/MainContext"
import { formatOrderText, showedOrdersFormater } from "@/utils/dataFormater"
import { useParams } from "next/navigation"

import style from "./pedido.module.css"
import { useEffect, useRef } from "react"
import html2canvas from "html2canvas"

export default function ConfirmarPedido() {
    const { orders, restaurantTables } = useBaseContext()
    const params = useParams()
    const mainRef = useRef(null)
    const montcounter = useRef(0)

    const [currentTable] = restaurantTables.filter(item => item.name == params.slug)
    const filteredOrders = orders
        .filter(item => item.itemQuantity > 0 && item.tableID == currentTable.name)
    const kicthen = showedOrdersFormater(filteredOrders
        .filter(item =>
            item.isPlaced == false &&
            !["drinks", "long neck", "cervejas 600ml"].includes(item.sectionName)
        ))

    const bar = showedOrdersFormater(filteredOrders
        .filter(item =>
            item.isPlaced == false &&
            ["drinks", "long neck", "cervejas 600ml"].includes(item.sectionName)
        ))

    const sendImageToServer = async (imageData: string) => {
        try {
            await fetch("/api/image", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(imageData),
            })
            console.log("Image sent successfully!")
        } catch (error) {
            console.error("Error sending image:", error)
        }
    }

    const capturePageImage = () => {
        if (mainRef.current)
            html2canvas(mainRef.current).then(canvas => {
                const image = canvas.toDataURL("image/bmp")
                sendImageToServer(image)
            })
    }

    useEffect(() => {
        if (montcounter.current == 0) capturePageImage()
        console.log('Componente montado', montcounter.current++)
        return () => {
            console.log('Componente desmontado')
        }
    }, [])

    return <main className={style.main}>
        <div ref={mainRef}>
            <div className={style.ordersKitchen}>
                <h3>Cozinha - Mesa {params.slug}</h3>
                <ul>
                    {kicthen.map(item =>
                        <li key={item.dishID + item.sectionName + item.clientNumber + item.tableID + item.info}>
                            <span className={style.orderInfo}>
                                {formatOrderText(
                                    item.itemQuantity,
                                    item.dishName,
                                    item.sectionName,
                                    item.info
                                )}
                            </span>
                        </li>
                    )}
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
                </ul>
            </div>
            <div className={style.ordersBar}>
                <h3>Bar - Mesa {params.slug}</h3>
                <ul>
                    {bar.map(item =>
                        <li key={item.dishID + item.sectionName + item.clientNumber + item.tableID + item.info}>
                            <span className={style.orderInfo}>
                                {formatOrderText(
                                    item.itemQuantity,
                                    item.dishName,
                                    item.sectionName,
                                    item.info
                                )}
                            </span>
                        </li>
                    )}

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
                </ul>
            </div>
        </div>
    </main>
}