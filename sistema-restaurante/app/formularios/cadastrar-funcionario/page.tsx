"use client"
import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { IoMdArrowBack } from "react-icons/io"
import { useRouter } from "next/navigation"

import style from "../formularios.module.css"
import { useBaseContext } from "@/contexts/MainContext"
import { hasAdminPermission } from "@/utils/testPermissions"

export default function RecordInfo() {
    const {user} = useBaseContext()
    const router = useRouter()
    const routerBack = () => router.back()

    const [formData, setFormData] = useState({
        name: "",
        username: "",
        password: "",
        confirmPass: "",
        role: "atendente",
    })

    const [formError, setFormError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const errorPass = formData.confirmPass != "" && formData.confirmPass != formData.password ?
        "Senhas não conferem" : ""

    const typeText = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const inputName = event.currentTarget.name
        const inputValue = event.currentTarget.value
        setFormData(previousValue => ({ ...previousValue, [inputName]: inputValue }))
    }

    const submitData = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsLoading(true)
        const { name, username, password, confirmPass, role } = formData
        if (name == "" && username == "" && password == "" && confirmPass == "" && role == "")
            return setFormError("Preencha todos os campos")

        if (username.length < 6 && password.length < 6)
            return setFormError("O nome de usuário e senha deve ter mais de 6 dígitos")

        const staff = { name, username: removeSpace(username), password, role }
        const response = await fetch("/api/usuario", {
            method: "POST",
            body: JSON.stringify(staff),
        })
        if (response.ok) {
            setFormError(`Usuário ${username} cadastrado com sucesso`)
            setFormData({
                name: "",
                username: "",
                password: "",
                confirmPass: "",
                role: "atendente",
            })
            setIsLoading(false)
            return
        }
        setFormError("Ocorreu algum erro")
        setIsLoading(false)
    }

    const removeSpace = (str: string) => str.replace(" ", "")

    useEffect(() => {
        if (!hasAdminPermission(user?.role!)) routerBack()
    }, [])

    return (
        <main className={style.main}>
            <div className={style.topOptions}>
                <button onClick={routerBack}><IoMdArrowBack /><span>Voltar</span></button>
            </div>

            <form className={style.form} onSubmit={submitData}>
                <div>
                    <h3 className={style.titleForm}>Adicionar funcionário</h3>
                    <label className={style.labelColHalf}>
                        <span>Nome</span>
                        <input type="text" name="name" onChange={typeText} value={formData.name} />
                    </label>
                    <label className={style.labelColHalf}>
                        <span>Usuário para acesso</span>
                        <input type="text" name="username" onChange={typeText} value={removeSpace(formData.username)} />
                    </label>
                    <label className={style.labelColHalf}>
                        <span>Senha</span>
                        <input type="password" name="password" onChange={typeText} value={formData.password} />
                    </label>
                    <label className={style.labelColHalf}>
                        <span>Confirme a senha</span>
                        <input type="password" name="confirmPass" onChange={typeText} value={formData.confirmPass} />
                        {errorPass}
                    </label>
                    <label className={style.labelCol}>
                        <span>Categoria</span>
                        <select onChange={typeText} name="role" value={formData.role}>
                            <option value="atendente">Atendente</option>
                            <option value="caixa">Caixa</option>
                        </select>
                    </label>
                    <button className={isLoading ? style.buttonLoading : style.buttonOptions} type="submit">
                        Atualizar dados
                    </button>
                    <span className={style.labelCol}>{formError}</span>
                </div>
            </form>
        </main >
    )
}
