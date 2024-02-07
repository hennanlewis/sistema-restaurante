import { currencyFormater, formatOrderText } from "@/utils/dataFormater"

import style from "../close.module.css"

type OrderByClientToImpressProps = {
    selectedClientOrders: OrderData[]
    selectedClient: number
    text: string
    type?: "price" | "reduced price" | "final price"
}

export function OrdersByClientToImpress({
    selectedClientOrders,
    selectedClient,
    text,
    type = "price"
}: OrderByClientToImpressProps) {

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