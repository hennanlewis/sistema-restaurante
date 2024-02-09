import { useBaseContext } from "@/contexts/MainContext"

import style from "./modalimpress.module.css"
import { formatOrderText, showedOrdersFormater } from "@/utils/dataFormater"
import { useRouter } from "next/navigation"

type ModalProps = {
    closeModal: () => void
    processOrders: () => void
    tableName: string
}

export function ModalImpress({ closeModal, processOrders, tableName }: ModalProps) {
    const { orders, restaurantTables } = useBaseContext()
    const router = useRouter()

    const [currentTable] = restaurantTables.filter(item => item.name == tableName)
    const filteredOrders = orders
        .filter(item => item.itemQuantity > 0 && item.tableID == currentTable.name)
    const waitingOrders = showedOrdersFormater(filteredOrders.filter(item => item.isPlaced == false))

    const printOrders = () => {
        localStorage.setItem("confirmOrders", JSON.stringify(waitingOrders))
        router.push(`/confirmar/${tableName}/pedido`)
    }

    return (
        <div className={style.modal}>
            <div className={style.modalContent}>
                <div className={style.orders}>
                    <h3>Pedidos - Mesa {tableName}</h3>
                    <ul>
                        {waitingOrders.map(item =>
                            <li key={item.dishID + item.sectionName + item.clientNumber + item.tableID + item.info}>
                                <span className={style.orderInfo}>
                                    {formatOrderText(
                                        item.itemQuantity,
                                        item.dishName,
                                        item.sectionName,
                                        item.servingsCount,
                                        item.info
                                    )}
                                </span>
                                {/* <span className={style.dots}></span>
                                <span className={style.price}>
                                    {currencyFormater(item.dishPrice * item.itemQuantity)}
                                </span> */}
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
                <button onClick={printOrders}>Imprimir pedido</button>
                <button onClick={processOrders}>Confirmar pedido</button>
                <button onClick={closeModal}>Fechar janela</button>
            </div>
        </div>
    )
}
