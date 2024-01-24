import { Suspense } from "react"
import { HomeComponent } from "./components/HomeComponent"
import { QRCodeComponent } from "./components/QRCode"


export default async function Home() {

    return <HomeComponent>
        <Suspense>
            <QRCodeComponent />
        </Suspense>
    </HomeComponent>
}
