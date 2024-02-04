import { currencyFormater, formatOrderText } from "@/utils/dataFormater"

import style from "../close.module.css"

type additionalCharge = {
    text: string
    value: number
}

type OrderByClientToImpressProps = {
    additionalCharges: additionalCharge[]
    hideButton?: boolean
}

export function AdditionalCharges({ additionalCharges, hideButton = false }: OrderByClientToImpressProps) {
    return (
        <>
            <ul>
                {additionalCharges.map((charge, index) =>
                <li key={"taxas-adicionais"+index}>
                    <span>{charge.text}</span>
                    <span className={style.dots}></span>
                    <span className={style.dots}></span>
                    <span>{currencyFormater(charge.value)}</span>
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