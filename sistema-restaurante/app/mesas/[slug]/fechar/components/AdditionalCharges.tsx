import { capitalizeFirstLetters, currencyFormater, formatOrderText } from "@/utils/dataFormater"

import style from "../close.module.css"
import { useParams, useRouter } from "next/navigation"

type additionalCharge = {
    text: string
    value: number
}

type OrderByClientToImpressProps = {
    additionalCharges: additionalCharge[]
    hideButton?: boolean
    hasDate?: boolean
    paymentMethod: string
    selectedClient: number
}

export function AdditionalCharges({
    additionalCharges,
    hideButton = false,
    hasDate = false,
    selectedClient,
    paymentMethod
}: OrderByClientToImpressProps) {
    const params = useParams()
    const router = useRouter()

    const printNotes = () => {
        if (selectedClient == 0)
            return router.push(`/confirmar/${params.slug}/fim?discount=${additionalCharges[1].value}`)

        router.push(`/confirmar/${params.slug}/fim?discount=${additionalCharges[1].value}&selectedClient=${selectedClient}`)
    }

    return (
        <>
            <ul className={style.list}>
                {additionalCharges.map((charge, index) =>
                    charge.text == "Desconto" && charge.value == 0 ? "" :
                        <li key={"taxas-adicionais" + index}>
                            <span>{charge.text}</span>
                            <span className={style.dots}></span>
                            <span className={style.dots}></span>
                            <span>{currencyFormater(charge.value)}</span>
                        </li>
                )}

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
                    onClick={printNotes}
                >
                    Imprimir nota
                </button>
            }
        </>
    )
}