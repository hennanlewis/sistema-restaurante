"use client"
import { useBaseContext } from "@/contexts/MainContext"
import { formatOrderText, showedOrdersFormater } from "@/utils/dataFormater"
import { useParams, useRouter } from "next/navigation"

import style from "./pedido.module.css"
import { MutableRefObject, useRef } from "react"
import html2canvas from "html2canvas"

export default function ConfirmOrders() {
    const { orders, restaurantTables } = useBaseContext()
    const params = useParams()
    const refKitchen = useRef(null)
    const refBar = useRef(null)
    const router = useRouter()
    const routerBack = () => router.back()

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
        if (local.current) {
            html2canvas(local.current).then(canvas => {
                const image = canvas.toDataURL("image/bmp")
                sendImageToServer(image)
            })
        }
    }

    const printOrders = () => {
        if(kicthen.length > 0) capturePageImage(refKitchen)
        if (bar.length > 0) capturePageImage(refBar)
    }

    return <main className={style.main}>
        <div>
            {kicthen.length > 0 && <div className={style.ordersKitchen} ref={refKitchen}>
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
            </div>}

            {bar.length > 0 && <div className={style.ordersBar} ref={refBar}>
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
            </div>}
            <div className={style.buttonOptions}>
                <button onClick={printOrders}>Imprimir pedidos</button>
                <button onClick={routerBack}>Voltar</button>
            </div>
        </div>
    </main>
}