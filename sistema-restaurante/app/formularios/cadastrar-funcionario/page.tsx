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
		role: "",
	})

	const [formError, setFormError] = useState("")

	const errorPass = formData.confirmPass != "" && formData.confirmPass != formData.password ?
		"Senhas não conferem" : ""

	const typeText = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const inputName = event.currentTarget.name
		const inputValue = event.currentTarget.value
		setFormData(previousValue => ({ ...previousValue, [inputName]: inputValue }))
	}

	const submitData = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const { name, username, password, confirmPass, role } = formData
		if (name == "" && username == "" && password == "" && confirmPass == "" && role == "")
			return setFormError("Preencha todos os campos")


	}

	return (
		<main className={style.main}>
			<div className={style.topOptions}>
				<button onClick={routerBack}><IoMdArrowBack /><span>Voltar</span></button>
			</div>

			<form className={style.form} onSubmit={submitData}>
				<div>
					<button type="button">Adicionar funcionário</button>
					<label className={style.labelCol}>
						<span>Nome</span>
						<input type="text" name="name" onChange={typeText} />
					</label>
					<label className={style.labelCol}>
						<span>Usuário para acesso</span>
						<input type="text" name="username" onChange={typeText} />
					</label>
					<label className={style.labelCol}>
						<span>Senha</span>
						<input type="password" name="password" onChange={typeText} />
					</label>
					<label className={style.labelCol}>
						<span>Confirme a senha</span>
						<input type="password" name="confirmPass" onChange={typeText} />
						{errorPass}
					</label>
					<label className={style.labelCol}>
						<span>Categoria</span>
						<select onChange={typeText} name="role">
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
