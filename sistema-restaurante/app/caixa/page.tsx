import MainComponent from "./MainComponent"

const getTotalCash = async () => {
    const url = `${process.env.VERCEL_URL}/api/caixa`
    const response = await fetch(url, { next: { revalidate: 10 } })
    return response.json()
}

type Cash = {
    orders: OrderData[],
    paymentMethod: "pix",
    discount: 38.72,
    serviceFee: 17.6,
    tableID: "1"
}

export default async function Caixa() {
    const totalCash: Cash[] = await getTotalCash()

    return <MainComponent totalCash={totalCash} />
}
