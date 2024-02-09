import MainComponent from "./MainComponent"

const getTotalCash = async () => {
    const url = `${process.env.VERCEL_URL}/api/caixa`
    const response = await fetch(url, { next: { revalidate: 1 } })
    return response.json()
}

type Cash = {
    orders: OrderData[]
    paymentMethod: string
    discount: number
    serviceFee: number
    tableID: string
}

export default async function Caixa() {
    const totalCash: Cash[] = await getTotalCash()

    return <MainComponent totalCash={totalCash} />
}
