import { ImInfo } from "react-icons/im"

import { formatOrderText, showedOrdersFormater } from "@/utils/dataFormater"
import { useBaseContext } from "@/contexts/MainContext"

import style from "../../mesas.module.css"
import { ChangeEvent, useState } from "react"

type ShowOrdersProps = {
    orders: OrderData[]
    label: string
    showAddInfo?: boolean
}

export function ShowOrders({ orders, label, showAddInfo = false }: ShowOrdersProps) {
    const { setOrders } = useBaseContext()
    const [showInfoInput, setShowInfoInput] = useState(false)
    const [selectedInfoInput, setSelectedInfoInput] = useState("")
    const filteredOrders = showedOrdersFormater(orders)

    const addOrderInfo = (event: ChangeEvent<HTMLInputElement>, keyOrderID: string) => {
        const [updatedOrderWithInfo] = orders.filter(order => order.keyOrderID == keyOrderID)
            .map(order => ({ ...order, info: event.target.value }))
        const updatedOrders = orders.map(order => order.keyOrderID == keyOrderID ? updatedOrderWithInfo : order)
        setOrders(updatedOrders)
    }

    return <>
        <h2 className={style.contentTitle}>{label}</h2>
        <div className={style.content}>
            <ul>
                {filteredOrders.length > 0 && filteredOrders
                    .map(order => {
                        const handleShowInfo = () => {
                            setShowInfoInput(true)
                            setSelectedInfoInput(order.keyOrderID)
                        }

                        return <li key={order.keyOrderID + "show order"}>
                            <span>
                                {formatOrderText(
                                    order.itemQuantity,
                                    order.dishName,
                                    order.sectionName,
                                    order.servingsCount,
                                    order.info
                                )}
                                {showAddInfo && <button onClick={handleShowInfo}><ImInfo /></button>}
                            </span>
                            {showInfoInput && selectedInfoInput == order.keyOrderID &&
                                <input type="text"
                                    onChange={(event) => addOrderInfo(event, order.keyOrderID)}
                                    value={order.info}
                                />
                            }
                        </li>
                    })
                }
            </ul>
            <label></label>
            {showInfoInput &&
                <button onClick={() => setShowInfoInput(false)} className={style.buttonOptions}>
                    Fechar adição de Observação
                </button>
            }
        </div>
    </>
}