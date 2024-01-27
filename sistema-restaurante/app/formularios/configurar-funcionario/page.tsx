"use client"
import { useEffect, useState } from "react"
import { IoMdArrowBack } from "react-icons/io"
import { useRouter } from "next/navigation"
import { SubmitHandler, set, useForm } from "react-hook-form"

import style from "../formularios.module.css"
import { useBaseContext } from "@/contexts/MainContext"
import { hasAdminPermission } from "@/utils/testPermissions"

type FormData = {
    id: string
    name: string
    username: string
    password: string
    confirmPass: string
    role: string,
    status: string
}

const defaultFormData: FormData = {
    id: "",
    name: "",
    username: "",
    password: "",
    confirmPass: "",
    role: "atendente",
    status: "",
}

export default function RecordInfo() {
    const { user } = useBaseContext()
    const router = useRouter()
    const routerBack = () => router.replace("/dashboard")

    const { handleSubmit, register, setValue } = useForm<FormData>()

    const [formData, setFormData] = useState<FormData>(defaultFormData)

    const [message, setMessage] = useState("")
    const [fetchedUsers, setfetchedUsers] = useState<{
        _id: string,
        name: string,
        username: string,
        role: string
    }[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [showForm, setShowForm] = useState(false)

    const errorPass = formData.confirmPass != "" && formData.confirmPass != formData.password ?
        "Senhas não conferem" : ""

    const temporaryMessage = (text: string) => {
        setMessage(text)
        setTimeout(() => setMessage(""), 3000)
    }

    const fetchUsers = async () => {
        setIsLoading(true)
        setMessage("Procurando funcionários...")
        try {
            const response = await fetch("/api/usuario")
            if (response.ok) {
                const data = await response.json()
                setfetchedUsers(data)
                console.log("Funcionários obtidos com sucesso!")
                temporaryMessage("Funcionários obtidos com sucesso!")
                return
            }
            console.error("Erro ao obter funcionários")
            temporaryMessage("Erro ao obter funcionários")
        } catch (error) {
            console.error("Erro ao realizar a requisição:", error)
            temporaryMessage("Erro ao obter funcionários. Tente outra vez.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleUserSelect = async (selectedId: string) => {
        setIsLoading(true)
        const response = await fetch(`/api/usuario?id=${selectedId}`)
        const [selectedUser] = await response.json()

        if (selectedUser) {
            setFormData({
                ...defaultFormData,
                id: selectedUser._id,
                name: selectedUser.name,
                username: selectedUser.username,
                role: selectedUser.role,
            })

            setValue("id", selectedUser._id)
            setValue("name", selectedUser.name)
            setValue("username", selectedUser.username)
            setValue("role", selectedUser.role)

            setShowForm(true)
        }
        setIsLoading(false)
    }

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        setIsLoading(true)
        const { name, username, password, confirmPass } = data
        if (name == "" || username == "" || password == "" || confirmPass == "") {
            setIsLoading(false)
            return setMessage("Preencha todos os campos")
        }

        if (username.length < 6 && password.length < 6)
            return setMessage("O nome de usuário e senha deve ter mais de 6 dígitos")

        const { confirmPass: testPass, ...employerData } = data
        const response = await fetch("/api/usuario", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(employerData),
        })

        if (response.ok) {
            setMessage(`Usuário ${username} atualizado com sucesso`)
            setFormData(defaultFormData)
            setIsLoading(false)
            return
        }
        setMessage("Ocorreu algum erro")
        setIsLoading(false)
    }

    const removeSpace = (str: string) => str.replace(" ", "")

    useEffect(() => {
        if (!hasAdminPermission(user?.role!)) routerBack()
    }, [])

    useEffect(() => { fetchUsers() }, [])
    useEffect(() => {

    }, [String(fetchedUsers)])

    return (
        <main className={style.main}>
            <div className={style.topOptions}>
                <button onClick={routerBack}><IoMdArrowBack /><span>Voltar</span></button>
            </div>

            <form className={style.form} onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <h3 className={style.titleForm}>Configurar funcionários</h3>
                    <label className={style.labelCol}>
                        <span>Selecione o funcionário:</span>
                        <select {...register("id")} onChange={(e) => handleUserSelect(e.target.value)}>
                            <option value="" disabled>Select an employee</option>
                            {fetchedUsers.sort((a, b) => a.name < b.name ? -1 : 1).map((user) => (
                                <option key={user._id} value={user._id}>
                                    {user.name}
                                </option>
                            ))}
                        </select>
                    </label>
                    {showForm && (
                        <>
                            <label className={style.labelColHalf}>
                                <span>Nome</span>
                                <input type="text" {...register("name")} />
                            </label>
                            <label className={style.labelColHalf}>
                                <span>Usuário para acesso</span>
                                <input type="text" {...register("username")} />
                            </label>
                            <label className={style.labelColHalf}>
                                <span>Senha</span>
                                <input type="password" {...register("password")} />
                            </label>
                            <label className={style.labelColHalf}>
                                <span>Confirme a senha</span>
                                <input type="password" {...register("confirmPass")} />
                                {errorPass}
                            </label>
                            <label className={style.labelCol}>
                                <select {...register("role")}>
                                    <option value="atendente">Atendente</option>
                                    <option value="caixa">Caixa</option>
                                    <option value="gerente">Gerente</option>
                                </select>
                            </label>
                            <label className={style.labelCol}>
                                <span>Desligar funcionário:</span>
                                <select {...register("status")}>
                                    <option value="ativo">Funcionário ativo</option>
                                    <option value="desligado">Desligar funcionário</option>
                                </select>
                            </label>
                        </>
                    )}
                    <button className={isLoading ? style.buttonLoading : style.buttonOptions}
                        type="submit" disabled={!showForm}
                    >
                        Atualizar dados
                    </button>

                    <span className={style.labelCol}>{message}</span>
                </div>
            </form>
        </main >
    )
}
