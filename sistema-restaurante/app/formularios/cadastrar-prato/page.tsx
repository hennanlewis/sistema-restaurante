"use client"
import { useEffect, useState } from "react"
import { IoMdArrowBack } from "react-icons/io"
import { useRouter } from "next/navigation"
import { SubmitHandler, useForm } from "react-hook-form"

import style from "../formularios.module.css"
import { capitalizeFirstLetters } from "@/utils/dataFormater"

type DishCategory = {
    _id: string
    name: string
}

export default function MenuItem() {
    const { register, handleSubmit} = useForm<DishDBInsertion>()

    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState("")
    const [categories, setCategories] = useState<DishCategory[]>([])

    const temporaryMessage = (text: string) => {
        setMessage(text)
        setTimeout(() => setMessage(""), 3000)
    }

    const fetchCategories = async () => {
        setIsLoading(true)
        setMessage("Obtendo categorias...")
        try {
            const response = await fetch("/api/obter-categorias", { next: { revalidate: 1 } })
            if (response.ok) {
                const data = await response.json()
                setCategories(data)
                console.log("Categorias obtidas com sucesso!")
                temporaryMessage("Categorias obtidas com sucesso!")
                return
            }
            console.error("Erro ao obter categorias")
            temporaryMessage("Erro ao obter categorias")
        } catch (error) {
            console.error("Erro ao realizar a requisição:", error)
            temporaryMessage("Erro ao obter categorias. Tente outra vez.")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => { fetchCategories() }, [])

    const onSubmit: SubmitHandler<DishDBInsertion> = async (data) => {
        setIsLoading(true)

        try {
            const response = await fetch("/api/cadastrar-prato", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({...data, dishPrice: Number(data.dishPrice)}),
            })

            if (response.ok) {
                console.log(`${data.dishName} cadastrado com sucesso!`)
                setMessage(`${capitalizeFirstLetters(data.dishName)} P${data.servingsCount} cadastrado com sucesso!`)
                return
            }

            console.error("Erro ao cadastrar o prato")
            temporaryMessage("Erro ao cadastrar o prato")
        } catch (error) {
            console.error("Erro ao enviar a requisição:", error)
            temporaryMessage("Erro ao tentar inserir o produto. Tente outra vez.")
        } finally {
            setIsLoading(false)
        }
    }

    const router = useRouter()
    const routerBack = () => router.back()

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
                        <select {...register("sectionName")}>
                            {categories.sort((a, b) => a.name < b.name ? -1 : 1).map((category) => (
                                <option key={category._id} value={category.name}>
                                    {capitalizeFirstLetters(category.name)}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className={style.labelColHalf}>
                        <span>Nome do prato</span>
                        <input type="text" {...register("dishName")} />
                    </label>
                    <label className={style.labelColHalf}>
                        <span>Pessoas servidas</span>
                        <input type="text" {...register("servingsCount")} />
                    </label>
                    <label className={style.labelColHalf}>
                        <span>Preço</span>
                        <input type="number" {...register("dishPrice")} min={0} />
                    </label>
                    <label className={style.labelCol}>
                        <span>Descrição</span>
                        <input type="text" {...register("subtext")} placeholder="Separe os itens por vírgula" />
                    </label>
                    <button className={isLoading ? style.buttonLoading : style.buttonOptions} type="submit">
                        Adicionar Prato
                    </button>
                </div>
                {message}
            </form>
        </main>
    )
}
