"use client"
import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"

import style from "@/app/style.module.css"

export default function Error({
	error,
	reset
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	const { slug } = useParams()
    const router = useRouter()
    const refresh = () => {
        router.replace("/")
    }
	useEffect(() => { console.error(error), [error] })

	return (
		<main className={style.error}>
			<h1 className="text-4xl font-black">Página da mesa {slug}</h1>
			<button className={style.errorButton} onClick={refresh}>
				Recarregar
			</button>
		</main>
	)
}