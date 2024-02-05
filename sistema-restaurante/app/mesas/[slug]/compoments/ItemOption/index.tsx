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
    const { _id, menuSectionId, dishName, dishId, dishPrice, servingsCount, tableID, sectionName } = props

    const itemQuantity = orders.filter((item) =>
        dishId == item.dishID &&
        item.tableID === tableID &&
        item.isPlaced == false
    ).length

    const updateDecrease = () => {
        const itemIndex = orders
            .findIndex((item) =>
                item.tableID === tableID &&
                item.isPlaced == false
            )

        if (itemIndex != -1) {
            setOrders(currentValues =>
                currentValues.filter((_, index) => index != itemIndex)
            )
        }
    }

    const updateIncrease = () => {
        const keyOrderID = dishId + tableID + incrementalHexNumber()
        const itemToAdd: OrderData = {
            _id: _id ?? "",
            keyOrderID: keyOrderID,
            tableID,
            dishID: dishId,
            itemQuantity: 1,
            clientNumber: 0,
            isPlaced: false,
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
            <span onClick={updateIncrease}>{itemQuantity}x {dishName} {servingsCount} {currencyFormater(dishPrice)}</span>
        </div>
    )
}
