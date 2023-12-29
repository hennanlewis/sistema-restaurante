"use client"
import { ChangeEvent, FormEvent, useState } from "react"

import style from "./style.module.css"
import { useBaseContext } from "@/contexts/MainContext"

export function HomeComponent() {
	const { setUser } = useBaseContext()
	const [login, setLogin] = useState({ username: "", password: "" })
	const typeText = (event: ChangeEvent<HTMLInputElement>) => {
		const inputName = event.currentTarget.name
		const inputValue = event.currentTarget.value
		setLogin(previousValue => ({ ...previousValue, [inputName]: inputValue }))
	}

	const submitLogin = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const response = await fetch("/api/signin", {
			method: "POST",
			body: JSON.stringify(login),
		})

		const user = await response.json()
		if (user) {
			localStorage.setItem("user", JSON.stringify({ username: user.username }))
			setUser(user)
		}
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
				<button type="submit" className={style.button}>
					Login
				</button>
			</form>
		</main>
	)
}
