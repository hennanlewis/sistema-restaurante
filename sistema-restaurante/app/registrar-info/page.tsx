"use client"
import { IoMdArrowBack } from "react-icons/io"
import { useRouter } from "next/navigation"

import style from "./registrarinfo.module.css"

export default function RecordInfo() {
	const router = useRouter()
	const routerBack = () => router.replace("/dashboard")

	return (
		<main className={style.main}>
			<div className={style.topOptions}>
				<button onClick={routerBack}><IoMdArrowBack /><span>Voltar</span></button>
			</div>
			<form className={style.form}>
				<div>
					<button type="button">Adicionar funcionário</button>
					<label className={style.labelCol}>
						<span>Nome</span>
						<input type="text" name="staffName" />
					</label>
					<label className={style.labelCol}>
						<span>Usuário</span>
						<input type="text" name="staffUser" />
					</label>
					<label className={style.labelCol}>
						<span>Senha</span>
						<input type="text" name="staffPass" />
					</label>
					<label className={style.labelCol}>
						<span>Categoria</span>
						<select name="stafRole">
							<option value="gerente">Gerente</option>
							<option value="caixa">Caixa</option>
							<option value="atendente">Atendente</option>
						</select>
					</label>
					<button className={style.buttonOptions}>Adicionar funcionário</button>
				</div>
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
