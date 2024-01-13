"use client"
import { ChangeEvent, FormEvent, useState } from "react"

import style from "./style.module.css"
import { useBaseContext } from "@/contexts/MainContext"

export function HomeComponent() {
	const { setUser } = useBaseContext()
	const [login, setLogin] = useState({ username: "", password: "" })
	const [formError, setFormError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const typeText = (event: ChangeEvent<HTMLInputElement>) => {
		const inputName = event.currentTarget.name
		const inputValue = event.currentTarget.value
		setLogin(previousValue => ({ ...previousValue, [inputName]: inputValue }))
	}

	const submitLogin = async (event: FormEvent<HTMLFormElement>) => {
        setFormError("")
        setIsLoading(true)
		event.preventDefault()
		console.log("Tentando logar")
		const response = await fetch("/api/signin", {
			method: "POST",
			body: JSON.stringify(login),
		})

		const user = await response.json()
		console.log(user)
		if (user) {
			localStorage.setItem("user", JSON.stringify(user))
			setUser(user)
			setFormError("")
			return
		}

		setFormError("Usuário ou senhas inválidos")
        setIsLoading(false)
	}

	return (
		<main className={style.main}>
			<form className={style.home} onSubmit={submitLogin} method="post">
				<h1 className="text-4xl font-black">Faça login</h1>
				<label className={style.field}>
					Usuário
					<input onChange={typeText} name="username" type="text" value={login.username} />
				</label>
				<label className={style.field}>
					Senha
					<input onChange={typeText} name="password" type="password" value={login.password} />
				</label>
                <button type="submit" className={isLoading ? style.loading : style.button}>
					Login
				</button>
				{formError}
			</form>
		</main>
	)
}
