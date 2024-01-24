"use client"
import QRCode from "qrcode.react"

import style from "./components.module.css"

export function QRCodeFrame({ host }: { host: string }) {

    return <div className={style.qrCode}>
        <h1 className="text-4xl font-black">Acesso pelo QRCode</h1>
        <div className={style.qrFrame}>
            <QRCode value={host} size={400} />
        </div>
        <p>Desenvolvido por <a href="https://hennan.dev">Hennan Lewis</a></p>
    </div>
}