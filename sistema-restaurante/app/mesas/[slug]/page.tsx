import { MainComponent } from "./compoments/MainComponent"

export async function generateMetadata({ params }: { params: { slug: string } }) {
    return {
        title: `Mesa ${params.slug} – Controle de Negócio`,
    }
}

export default function Mesas({ params }: { params: { slug: string } }) {

    return <MainComponent params={params} />
}
