import { QRCodeFrame } from "../QRCodeFrame"

async function getHost() {
    const urlReq = `${process.env.VERCEL_URL}/api/link-acesso`
    const response = await fetch(urlReq, {
        method: "POST",
        body: JSON.stringify({ restaurant: "Restaurante Sabor do Mar" }),
    })

    if (response.ok) return await response.json()

    return { host: process.env.VERCEL_URL }
}

export async function QRCodeComponent() {
    const { host } = await getHost()

    return <QRCodeFrame host={host} />
}
