import { formatOrderText, showedOrdersFormater } from "@/utils/dataFormater"

import style from "../../mesas.module.css"

type ShowOrdersProps = {
    orders: OrderData[]
    label: string
}

export function ShowOrders({ orders, label }: ShowOrdersProps) {
    const filteredOrders = showedOrdersFormater(orders)

    return <>
        <h2 className={style.contentTitle}>{label}</h2>
        <div className={style.content}><ul>
            {filteredOrders.length > 0 && filteredOrders
                .map(item =>
                    <li key={item.itemID + item.sectionName + item.clientNumber + item.tableID}>
                        {formatOrderText(
                            item.itemQuantity,
                            item.dishName,
                            item.sectionName,
                            item.dishPrice
                        )}
                    </li>
                )
            }
        </ul></div>
    </>
}