export const currencyFormater = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(value)

export const listFormater = (string: string[]) =>
    capitalizeFirstLetters(new Intl.ListFormat("pt-BR", {
        style: "long",
        type: "conjunction",
    }).format(string))

export const capitalizeFirstLetters = (string: string) => {
    if (string.length == 0) return string
    return string.charAt(0).toUpperCase() + string.slice(1)
}

export const writeCategory = (sectionName: string) => {
    if (sectionName === "cervejas 600ml") return " (600ml) "
    if(sectionName === "long neck") return " (Long Neck) "
    return ""
}

export const formatOrderText = (
    itemQuantity: number,
    dishName: string,
    sectionName: string,
    servingsCount: string,
    hint?: string
) => `${itemQuantity}x ${dishName} ${servingsCount} ${writeCategory(sectionName)}${hint ? ` (OBS.: ${hint})` : ""}`

export const sumArrayValues = (array: number[]) =>
    array.reduce((sum, itemValue) => sum += itemValue, 0)

export const str2Slug = (input: string) => input.toLocaleLowerCase().replace(" ", "_")

export const showedOrdersFormater = (orders: OrderData[]) => {
    const filteredOrders: OrderData[] = []
    for (const order of orders) {
        const itemTotalQuantity = orders.filter(item => item.dishID == order.dishID && item.info == order.info).length
        const totalReducedPrice = sumArrayValues(orders
            .filter(item => item.dishID == order.dishID && item.info == order.info)
            .map(item => item.reducedPrice || 0))
        const isOnFilteredOrders = filteredOrders
            .some(item => item.dishID == order.dishID && item.info == order.info)
        if (!isOnFilteredOrders) {
            filteredOrders.push({
                ...order,
                itemQuantity: itemTotalQuantity,
                info: order.info,
                reducedPrice: totalReducedPrice
            })
        }
    }

    return filteredOrders
}
