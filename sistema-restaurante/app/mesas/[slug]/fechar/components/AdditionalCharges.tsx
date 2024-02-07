import { capitalizeFirstLetters, currencyFormater, formatOrderText } from "@/utils/dataFormater"

import style from "../close.module.css"

type additionalCharge = {
    text: string
    value: number
}

type OrderByClientToImpressProps = {
    additionalCharges: additionalCharge[]
    hideButton?: boolean
    hasDate?: boolean
    paymentMethod: string
}

export function AdditionalCharges({
    additionalCharges,
    hideButton = false,
    hasDate = false,
    paymentMethod
}: OrderByClientToImpressProps) {

    return (
        <>
            <ul className={style.list}>
                {additionalCharges.map((charge, index) =>
                    <li key={"taxas-adicionais" + index}>
                        <span>{charge.text}</span>
                        <span className={style.dots}></span>
                        <span className={style.dots}></span>
                        <span>{currencyFormater(charge.value)}</span>
                    </li>
                )}
                <li className={style.paymentMethod}>
                    <span>Método de pagamento</span>
                    <span className={style.dots}></span>
                    <span className={style.dots}></span>
                    <span>{capitalizeFirstLetters(paymentMethod)}</span>
                </li>
                {hasDate && <>
                    <li className={style.date}>
                        <span>Data: </span>
                        <span>
                            {new Intl.DateTimeFormat("pt-BR", {}).format(Date.now())}
                        </span>
                        <span>
                            {new Intl.DateTimeFormat("pt-BR", {
                                hour: "numeric",
                                minute: "numeric",
                                second: "numeric"
                            }).format(Date.now())}
                        </span>
                    </li>
                </>}
            </ul>
            {!hideButton &&
                <button
                    className={style.buttonOptions}
                    onClick={() => window.print()}
                >
                    Imprimir nota
                </button>
            }
        </>
    )
}