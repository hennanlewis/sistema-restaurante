"use client"
import { useEffect } from "react"

import style from "@/app/style.module.css"
import { useParams } from "next/navigation"

export default function Error({
	error,
	reset
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	const { slug } = useParams()
	useEffect(() => { console.error(error), [error] })

	return (
		<main className={style.error}>
			<h1 className="text-4xl font-black">Configurar pedidos</h1>
			<button className={style.errorButton} onClick={() => reset()}>
				Recarregar dados
			</button>
		</main>
	)
}