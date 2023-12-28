"use client"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export const useCustomHook = () => {
	const [user, setUser] = useState()
	const pathname = usePathname()
	const router = useRouter()

	useEffect(() => {
		const loginData = JSON.parse(localStorage.getItem("user")!)

		if(loginData) setUser(loginData)

		const { username, role } = loginData
		if (username && role && pathname == "/") {
			router.push("/dashboard")
		}
	}, [router, pathname])

	return user
}
