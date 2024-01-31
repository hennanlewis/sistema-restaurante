import { MainComponent } from "./compoments/MainComponent"

export async function generateMetadata({ params }: { params: { slug: string } }) {
    return {
        title: `Mesa ${params.slug} – Controle de Negócio`,
    }
}

const getMenuData = async () => {
    const url = `${process.env.VERCEL_URL}/api/menu`
    const response = await fetch(url, { next: { revalidate: 10 } })
    return response.json()
}

export default async function Mesas() {
    const menuData: MenuSection[] = await getMenuData()

    return <MainComponent itemsMenu={menuData} />
}
