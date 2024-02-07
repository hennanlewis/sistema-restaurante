import { insertImage } from "@/db/db"
import { NextRequest } from "next/server"
import fs from "fs"
import path from "path"
import { writeFile } from "fs/promises"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
    try {
        const imageData = await request.json()

        if (!imageData) {
            throw new Error("No image data received.")
        }

        const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "")
        const buffer = Buffer.from(base64Data, "base64")

        const filename = Date.now() + ".jpg"

        await writeFile(
            path.join(process.cwd(), "public/uploaded-images", filename),
            buffer
        )
        return Response.json("Image saved successfully.", { status: 200 })
    } catch (error) {
        console.error("Error occurred:", error)
        return new Response("Failed to save image.", { status: 500 })
    }
}

// try {
//     const imageData = await request.formData()

//     const file = imageData.get("file")
//     if (!file) {
//         return Response.json({ error: "No files received." }, { status: 400 })
//     }
//     const buffer = Buffer.from(await file.arrayBuffer())
//     const filename = Date.now() + file.name.replaceAll(" ", "_")
//     console.log(filename)
//     // const imagePath = path.join(process.cwd(), "public", "uploaded-images", `${String(new ObjectId())}.jpg`)
//     // fs.writeFile(imagePath, imageData, "base64", (err) => {
//     //     if (err) {
//     //         console.error("Erro ao salvar a imagem:", err)
//     //         return Response.json({ error: "Erro ao salvar a imagem." }, { status: 400 })
//     //     } else {
//     //         console.log("Imagem salva com sucesso.")
//     //         return Response.json({ success: true }, { status: 200 })
//     //     }
//     // })


//     // const response = await insertImage(imageData)
//     // if (response !== null) {
//     //     return Response.json("Image received successfully!", { status: 200 })
//     // }
//     throw new Error("Image not saved")
// } catch (error) {
//     return new Response(`Webhook error: ${error}`, {
//         status: 400,
//     })
// }