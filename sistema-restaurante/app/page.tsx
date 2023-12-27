"use client"
import { ChangeEvent, FormEvent, useEffect, useState } from "react"

import style from "./style.module.css"
import { useCustomHook } from "@/hooks/customHook"

export default function Home() {
	const [login, setLogin] = useState({ user: "", password: "" })
	const typeText = (event: ChangeEvent<HTMLInputElement>) => {
		const inputName = event.currentTarget.name
		const inputValue = event.currentTarget.value
		setLogin(previousValue => ({ ...previousValue, [inputName]: inputValue }))
	}

	const submitLogin = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		localStorage.setItem("local", JSON.stringify(login))
	}

	const custome = useCustomHook()
	useEffect(() => {
		console.log(custome)
	}, [custome])

	return (
		<main className={style.main}>
			<form className={style.home} onSubmit={submitLogin} method="post">
				<h1 className="text-4xl font-black">Faça login</h1>
				<label className={style.field}>
					Email
					<input onChange={typeText} name="user" type="text" value={login.user} />
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
