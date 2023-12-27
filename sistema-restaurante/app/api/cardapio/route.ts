import cardapio from "@/utils/cardapio.json"
export async function GET() {
	return Response.json(cardapio.menu)
}