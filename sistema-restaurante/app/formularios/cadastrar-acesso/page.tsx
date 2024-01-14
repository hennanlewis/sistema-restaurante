"use client"
import { ChangeEvent, FormEvent, useState } from "react"
import { IoMdArrowBack } from "react-icons/io"
import { useRouter } from "next/navigation"

import style from "../formularios.module.css"

export default function RecordInfo() {
    const router = useRouter()
    const routerBack = () => router.replace("/dashboard")

    const [formData, setFormData] = useState({
        name: "",
        username: "",
        password: "",
        confirmPass: "",
        role: "atendente",
    })

    const [formError, setFormError] = useState("")

    const errorPass = formData.confirmPass != "" && formData.confirmPass != formData.password ?
        "Senhas não conferem" : ""

    const typeText = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const inputName = event.currentTarget.name
        const inputValue = event.currentTarget.value
        setFormData(previousValue => ({ ...previousValue, [inputName]: inputValue }))
    }

    const submitData = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const { name, username, password, confirmPass, role } = formData
        if (name == "" && username == "" && password == "" && confirmPass == "" && role == "")
            return setFormError("Preencha todos os campos")

        if (username.length < 6 && password.length < 6)
            return setFormError("O nome de usuário e senha deve ter mais de 6 dígitos")

        const staff = { name, username: removeSpace(username), password, role }
        const response = await fetch("/api/casdastrar-acesso", {
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
            return
        }
        setFormError("Ocorreu algum erro")
    }

    const removeSpace = (str: string) => str.replace(" ", "")

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
                    <button className={style.buttonOptions} type="submit">Adicionar funcionário</button>
                    {formError}
                </div>
            </form>
        </main >
    )
}
