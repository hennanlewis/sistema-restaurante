import { ImMinus, ImPlus } from "react-icons/im"
import { currencyFormater } from "@/utils/dataFormater"

import style from "./itemoption.module.css"
import { useBaseContext } from "@/contexts/MainContext"

type MenuItemProps = MenuItem & {
    menuSectionId: string
    sectionName: string
    tableID: string
}

export function ItemOption(props: MenuItemProps) {
    const { orders, setOrders, user, incrementalHexNumber } = useBaseContext()
    const { menuSectionId, dishName, dishId, dishPrice, servingsCount, tableID, sectionName } = props

    const itemQuantity = orders.filter((item) =>
        item.tableID === tableID &&
        item.isFinished == false
    ).length

    const updateDecrease = () => {
        const itemIndex = orders
            .findIndex((item) =>
                item.tableID === tableID &&
                item.isFinished == false
            )

        if (itemIndex != -1) {
            setOrders(currentValues =>
                currentValues.filter((_, index) => index != itemIndex)
            )
        }
    }

    const updateIncrease = () => {
        const keyOrderID = incrementalHexNumber() + menuSectionId + dishId
        const itemToAdd: OrderData = {
            keyOrderID: keyOrderID,
            tableID,
            itemID: dishId,
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
