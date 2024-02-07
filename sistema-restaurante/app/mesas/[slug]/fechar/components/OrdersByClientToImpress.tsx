import { currencyFormater, formatOrderText } from "@/utils/dataFormater"

import style from "../close.module.css"

type OrderByClientToImpressProps = {
    selectedClientOrders: OrderData[]
    selectedClient: number
    text: string
    type?: "price" | "reduced price" | "final price"
    cupom?: boolean
    hasDate?: boolean
}

export function OrdersByClientToImpress({
    selectedClientOrders,
    selectedClient,
    text,
    type = "price",
    cupom = false,
    hasDate = false
}: OrderByClientToImpressProps) {

    return (
        <>
            <ul className={style.list}>
                <li className={style.logoImg}>
                    <img src="/logo.png" alt="" /></li>
                <li className={style.listTitle}>{text}</li>

                {cupom && <>
                    <li className={style.listItemCenter}>Avenida Beira Mar, 0</li>
                    <li className={style.listItemCenter}>Vila Preá, Cruz/CE</li>
                    <li className={style.splitterDash}>CEP: 62595000</li>
                    <li className={style.splitterHeader}>
                        <span>Produto</span>
                        <span>Valor</span>
                    </li>
                </>}

                {selectedClientOrders.map(order =>
                    <li key={"fechar client" + selectedClient + order._id}>
                        <span>{formatOrderText(
                            order.itemQuantity,
                            order.dishName,
                            order.sectionName,
                            order.info
                        )}</span>
                        <span className={style.dots}></span>
                        <span className={style.dots}></span>
                        {type == "price" && <span>{currencyFormater(order.dishPrice * order.itemQuantity)}</span>}
                        {type == "reduced price" &&
                            <span>{currencyFormater((order.reducedPrice || 0) * order.itemQuantity)}</span>
                        }
                        {type == "final price" &&
                            <span>
                                {currencyFormater((order.dishPrice) * order.itemQuantity - (order.reducedPrice || 0))}
                            </span>
                        }
                    </li>
                )}
            </ul>
        </>
    )
}