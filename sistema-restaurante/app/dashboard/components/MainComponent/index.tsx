"use client"
import { NavMenu } from "../NavMenu"

import style from "./dashboard.module.css"
import { hasAdminPermission } from "@/utils/testPermissions"
import { useBaseContext } from "@/contexts/MainContext"

export function MainComponent() {
    const { user } = useBaseContext()

    const menuOptions = [
        { keyNumber: 1, label: "Pedidos", url: "/mesas", permission: true },
        { keyNumber: 2, label: "Relatórios", url: "/relatorios", permission: hasAdminPermission(user?.role!) },
        { keyNumber: 3, label: "Cadastrar mesa", url: "/formularios/cadastrar-mesa", permission: hasAdminPermission(user?.role!) },
        { keyNumber: 4, label: "Cadastrar funcionário", url: "/formularios/cadastrar-acesso", permission: hasAdminPermission(user?.role!) },
        { keyNumber: 5, label: "Configurar funcionário", url: "/formularios/configurar-funcionario", permission: hasAdminPermission(user?.role!) },
        { keyNumber: 6, label: "Cadastrar item ao menu", url: "/formularios/cadastrar-prato", permission: hasAdminPermission(user?.role!) },
        { keyNumber: 7, label: "Sair", url: "/logoff", permission: true },
    ]

    return (
        <main className={style.main}>
            <div className="text-base"></div>
            {menuOptions.map(option =>
                option.permission && <NavMenu
                    key={option.keyNumber + option.label}
                    label={option.label}
                    url={option.url}
                />
            )}
        </main>
    )
}