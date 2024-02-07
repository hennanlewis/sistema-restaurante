"use client"
import { ChangeEvent, FormEvent, useState } from "react"
import { IoMdArrowBack } from "react-icons/io"
import { useRouter } from "next/navigation"

import style from "../formularios.module.css"
import { set } from "react-hook-form"

export default function AddTable() {
    const [formError, setFormError] = useState("")
    const [formData, setFormData] = useState({
        name: "",
        ordersTotalPrice: 0,
        ordersTotalQuantity: 0,
        customersQuantity: 0,
        occupiedAt: null
    })
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const routerBack = () => router.back()

    const changeData = (event: ChangeEvent<HTMLInputElement>) => {
        const inputName = event.currentTarget.name
        const inputValue = event.currentTarget.value
        setFormData(previousValue => ({ ...previousValue, [inputName]: inputValue }))
    }

    const submitData = async (event: FormEvent<HTMLFormElement>) => {
        setIsLoading(true)
        event.preventDefault()
        if (formData.name == "") {
            setIsLoading(false)
            return setFormError("Preencha todos os campos")
        }

        const response = await fetch("/api/cadastrar-mesa", {
            method: "POST",
            body: JSON.stringify(formData),
        })
        if (response.ok) {
            setFormError(`Mesa ${formData.name} cadastrada com sucesso`)
            setFormData({
                name: "",
                ordersTotalPrice: 0,
                ordersTotalQuantity: 0,
                customersQuantity: 0,
                occupiedAt: null
            })
            setIsLoading(false)
            return
        }
        setFormError("Ocorreu algum erro")
        setIsLoading(false)
    }

    return (
        <main className={style.main}>
            <div className={style.topOptions}>
                <button onClick={routerBack}><IoMdArrowBack /><span>Voltar</span></button>
            </div>
            <form className={style.form} onSubmit={submitData}>
                <div>
                    <button type="button">Adicionar mesa</button>
                    <label className={style.labelCol}>
                        <span>Número</span>
                        <input type="number" name="name" onChange={changeData} value={formData.name} min={1} />
                    </label>
                    <button className={isLoading ? style.buttonLoading : style.buttonOptions}>
                        Adicionar mesa
                    </button>
                    {formError}
                </div>
            </form>
        </main >
    )
}
