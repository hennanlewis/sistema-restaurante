import { currencyFormater, formatOrderText } from "@/utils/dataFormater"

import style from "../close.module.css"

type OrderByClientToImpressProps = {
    selectedClientOrders: OrderData[]
    selectedClient: number
    text: string
    hideButton?: boolean
}

export function OrdersByClientToImpress({ selectedClientOrders, selectedClient, text, hideButton = false }: OrderByClientToImpressProps) {
    return (
        <>
            <ul>
                <li className="mb-1">{text}</li>
                {selectedClientOrders.map(order =>
                    <li key={"fechar client" + selectedClient + order._id}>
                        <span>{formatOrderText(
                            order.itemQuantity,
                            order.dishName,
                            order.sectionName,
                            order.dishPrice
                        )}</span>
                        <span className={style.dots}></span>
                        <span className={style.dots}></span>
                        <span>{currencyFormater(order.dishPrice * order.itemQuantity)}</span>
                    </li>
                )}
            </ul>
            {!hideButton &&
                <button
                    className={style.buttonOptions}
                    onClick={() => window.print()}
                >
                    Imprimir pedidos
                </button>
            }
        </>
    )
}