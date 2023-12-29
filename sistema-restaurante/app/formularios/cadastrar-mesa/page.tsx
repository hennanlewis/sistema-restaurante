"use client"
import { useState } from "react"
import { IoMdArrowBack } from "react-icons/io"
import { useRouter } from "next/navigation"

import style from "./registrarinfo.module.css"

export default function AddTable() {
	const [formData, setFormData] = useState()
	const router = useRouter()
	const routerBack = () => router.replace("/dashboard")

	const addNewStaff = () => {

	}

	return (
		<main className={style.main}>
			<div className={style.topOptions}>
				<button onClick={routerBack}><IoMdArrowBack /><span>Voltar</span></button>
			</div>
			<form className={style.form}>
				<div>
					<button type="button">Adicionar mesa</button>
					<label className={style.labelCol}>
						<span>Número</span>
						<input type="number" value={1} min={1} />
					</label>
					<button className={style.buttonOptions}>Adicionar mesa</button>
				</div>
			</form>
		</main >
	)
}
