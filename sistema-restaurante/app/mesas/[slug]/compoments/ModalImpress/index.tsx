import { useBaseContext } from "@/contexts/MainContext"

import style from "./modalimpress.module.css"
import { currencyFormater, formatOrderText, showedOrdersFormater, sumArrayValues } from "@/utils/dataFormater"

type ModalProps = {
    closeModal: () => void
    processOrders: () => void
    tableName: string
}

export function ModalImpress({ closeModal, processOrders, tableName }: ModalProps) {
    const { orders, restaurantTables } = useBaseContext()

    const [currentTable] = restaurantTables.filter(item => item.name == tableName)
    const filteredOrders = orders
        .filter(item => item.itemQuantity > 0 && item.tableID == currentTable.name)
    const waitingOrders = showedOrdersFormater(filteredOrders.filter(item => item.isPlaced == false))

    const printOrders = () => {
        window.print()
    }

    return (
        <div className={style.modal}>
            <div className={style.modalContent}>
                <div className={style.orders}>
                    <h3>Pedidos - Mesa {tableName}</h3>
                    <ul>
                        {waitingOrders.map(item =>
                            <li key={item.dishID + item.sectionName + item.clientNumber + item.tableID}>
                                <span>{formatOrderText(
                                    item.itemQuantity,
                                    item.dishName,
                                    item.sectionName,
                                    item.dishPrice
                                )}</span>
                                <span className={style.dots}></span>
                                <span className={style.dots}></span>
                                <span>{currencyFormater(item.dishPrice * item.itemQuantity)}</span>
                            </li>
                        )}
                        <li>
                            <span>Total</span>
                            <span className={style.dots}></span>
                            <span className={style.dots}></span>
                            <span>{currencyFormater(sumArrayValues(waitingOrders.map(item => item.dishPrice * item.itemQuantity)))}</span>
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
