"use client"
import { useEffect } from "react"

import style from "./style.module.css"

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	useEffect(() => console.error(error), [error])

	return (
		<main className={style.error}>
			<h1 className={style.errorTitle}>Eita!</h1>
			<h2>Desculpe, mas correu um erro</h2>
			<button className={style.errorButton} onClick={() => reset()}>
				Carregar novamente
			</button>
		</main>
	)
}