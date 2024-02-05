"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

import style from "../components/components.module.css"
import { useBaseContext } from "@/contexts/MainContext"

export default function HomeComponent() {
    const { setUser } = useBaseContext()
    const router = useRouter()

    useEffect(() => {
        setUser(null)
        localStorage.removeItem("user")
        router.push("/")
    }, [])

    return (
        <main className={style.main}>
            <div className={style.home}>
                <h1 className="text-4xl font-black">Desfazendo login</h1>
            </div>

        </main>
    )
}
