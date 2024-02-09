"use client"
import { IoMdArrowBack } from "react-icons/io"
import { useRouter } from "next/navigation"

import style from "./caixa.module.css"
import { currencyFormater, sumArrayValues } from "@/utils/dataFormater"

type Cash = {
    orders: OrderData[]
    paymentMethod: string
    discount: number
    serviceFee: number
    tableID: string
}

export default function MainComponent({ totalCash }: { totalCash: Cash[] }) {
    const router = useRouter()
    const mainPage = () => router.back()
    console.log(totalCash)

    return (
        <main className={style.main}>
            <div className={style.container}>
                <div className={style.topOptions}>
                    <button onClick={mainPage}><IoMdArrowBack /><span>Voltar</span></button>
                </div>
                <div className={style.content}>
                    Valor total: {currencyFormater(sumArrayValues(totalCash
                        .map((cash) => sumArrayValues(cash.orders
                            .map((order) => order.dishPrice * order.itemQuantity))
                            + cash.serviceFee - cash.discount
                        )))}
                </div>
            </div>
        </main >
    )
}