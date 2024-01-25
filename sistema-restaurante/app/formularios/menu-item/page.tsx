"use client"
import { IoMdArrowBack } from "react-icons/io"
import { useRouter } from "next/navigation"
import { SubmitHandler, useForm } from "react-hook-form"

import style from "../formularios.module.css"
type FormData = {
    sectionName: string
    dishName: string
    servingsCount: number
    dishPrice: number
    subtext: string
}

export default function MenuItem() {
    const { register, handleSubmit } = useForm<FormData>()

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        // e.preventDefault() // Evita o recarregamento da página

        console.log(data)

        try {
            const response = await fetch("/api/cadastrar-prato", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            if (response.ok) {
                console.log("Prato cadastrado com sucesso!")
                // Faça o que precisar após o sucesso (redirecionamento, etc.)
            } else {
                console.error("Erro ao cadastrar o prato")
                // Lidere com o erro de acordo com suas necessidades
            }
        } catch (error) {
            console.error("Erro ao enviar a requisição:", error)
            // Lidere com o erro de acordo com suas necessidades
        }
    }

    const router = useRouter()
    const routerBack = () => router.replace("/dashboard")

    return (
        <main className={style.main}>
            <div className={style.topOptions}>
                <button onClick={routerBack}>
                    <IoMdArrowBack />
                    <span>Voltar</span>
                </button>
            </div>
            <form className={style.form} onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label className={style.labelColHalf}>
                        <span>Nome da seção</span>
                        <input type="text" {...register("sectionName")} />
                    </label>
                    <label className={style.labelColHalf}>
                        <span>Nome do prato</span>
                        <input type="text" {...register("dishName")} />
                    </label>
                    <label className={style.labelColHalf}>
                        <span>Pessoas servidas</span>
                        <input type="number" {...register("servingsCount")} min={1} />
                    </label>
                    <label className={style.labelColHalf}>
                        <span>Preço</span>
                        <input type="number" {...register("dishPrice")} min={0} />
                    </label>
                    <label className={style.labelCol}>
                        <span>Descrição</span>
                        <input type="text" {...register("subtext")} placeholder="Separe os itens por vírgula" />
                    </label>
                    <button className={style.buttonOptions} type="submit">
                        Adicionar Prato
                    </button>
                </div>
            </form>
        </main>
    )
}
