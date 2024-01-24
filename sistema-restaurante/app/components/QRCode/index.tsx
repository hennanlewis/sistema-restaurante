import { QRCodeFrame } from "../QRCodeFrame"

async function getHost() {
    const urlReq = `${process.env.VERCEL_URL}/api/link-acesso`
    const response = await fetch(urlReq, {
        method: "POST",
        body: JSON.stringify({ restaurant: "Restaurante Sabor do Mar" }),
    })
    return response.json()
}

export async function QRCodeComponent() {
    const { host } = await getHost()

    return <QRCodeFrame host={host} />
}
