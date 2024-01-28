"use client"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export const useCustomHook = () => {
    const [user, setUser] = useState()
    const pathname = usePathname()
    const router = useRouter()

    useEffect(() => {
        const loginDataString = localStorage.getItem("user")

        if (!loginDataString)
            return router.replace("/") 

        const loginData = JSON.parse(loginDataString)

        if (!loginData || !loginData.username) {
            return router.replace("/")
        }

        if (!loginData && !loginData.username && pathname !== "/") {
            return router.replace("/")
        }

    }, [router, pathname])

    return user
}
