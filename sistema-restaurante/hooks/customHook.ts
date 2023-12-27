"use client"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

export const useCustomHook = () => {
	const pathname = usePathname()
	const router = useRouter()
	useEffect(() => {
		const loginData = JSON.parse(localStorage.getItem("local")!) || { user: "", password: "" }
		const { user, password } = loginData
		if (user == "usuario123" && password == "qwer1234" && pathname == "/") {
			console.log(pathname)
			router.push("/restaurante")
		}
	}, [router, pathname])
	return pathname
}
