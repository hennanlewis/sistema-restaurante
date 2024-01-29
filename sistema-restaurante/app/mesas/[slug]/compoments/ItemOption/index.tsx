import { ImMinus, ImPlus } from "react-icons/im"
import { currencyFormater } from "@/utils/dataFormater"

import style from "./itemoption.module.css"
import { useBaseContext } from "@/contexts/MainContext"

type MenuItemProps = MenuItem & { sectionName: string, tableID: string }

export function ItemOption(props: MenuItemProps) {
    const { orders, setOrders, user } = useBaseContext()
    const { _id, dishName, dishPrice, servingsCount, tableID, sectionName } = props
    const currentID = _id
    const itemQuantity = orders
        .filter((item) =>
            currentID == item.itemID &&
            item.tableID === tableID &&
            item.isFinished == false
        ).length

    const updateDecrease = () => {
        const itemIndex = orders
            .findIndex((item) =>
                item.tableID === tableID &&
                item.itemID === currentID &&
                item.isFinished == false
            )

        if (itemIndex != -1) {
            setOrders(currentValues =>
                currentValues.filter((_, index) => index != itemIndex)
            )
        }
    }

    const updateIncrease = () => {
        const itemToAdd: OrderData = {
            tableID,
            itemID: currentID!,
            itemQuantity: 1,
            clientNumber: 1,
            isFinished: false,
            employeer: user?.username!,
            dishName,
            dishPrice,
            servingsCount,
            sectionName
        }

        setOrders(currentValues => [...currentValues, itemToAdd])
    }

    return (
        <div className={style.orderItem}>
            <span className={style.buttons}>
                <button onClick={updateDecrease}><ImMinus /></button>
                <button onClick={updateIncrease}><ImPlus /></button>
            </span>
            <span>{itemQuantity}x {dishName} {servingsCount} {currencyFormater(dishPrice)}</span>
        </div>
    )
}
