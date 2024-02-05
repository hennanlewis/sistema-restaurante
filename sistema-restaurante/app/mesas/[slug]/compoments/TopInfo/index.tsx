"use client"
import Link from "next/link"
import { IoMdArrowBack } from "react-icons/io"
import { useParams, usePathname, useRouter } from "next/navigation"
import { hasAdminPermission } from "@/utils/testPermissions"
import { currencyFormater, sumArrayValues } from "@/utils/dataFormater"
import { ElapsedTimer } from "@/app/mesas/components/ElapserTime"
import { useBaseContext } from "@/contexts/MainContext"

import { TableOrderInfo } from "../TableInfo"
import style from "./topinfo.module.css"

type TopInfoProps = {
	hideCloseOrder?: boolean
}

export default function TopInfo({ hideCloseOrder = false }: TopInfoProps) {
	const { orders, restaurantTables, user } = useBaseContext()
	const router = useRouter()
	const params = useParams()
    const pathname = usePathname()

	const [currentTable] = restaurantTables.filter(item => item.name == params.slug)
	const filteredOrders = orders
		.filter(item => item.itemQuantity > 0 && item.tableID == currentTable.name)
	const processedOrders = filteredOrders.filter(item => item.isPlaced == true)

	const orderTotalPrice = sumArrayValues(processedOrders.map(item => item.itemQuantity * item.dishPrice))
	const formatedOrderTotalPrice = currencyFormater(orderTotalPrice)
	const totalItemsQuantity = sumArrayValues(processedOrders.map(item => item.itemQuantity))
	const customersQuantity = currentTable.customersQuantity
	const tableIndentification = "Mesa " + currentTable.name

	const tableOrderData = [
		{ keyNumber: 1, label: "Identificação", value: tableIndentification, isHalfSized: false },
		{ keyNumber: 2, label: "Total de itens", value: totalItemsQuantity, isHalfSized: true },
		{ keyNumber: 3, label: "Clientes", value: customersQuantity, isHalfSized: true },
		{ keyNumber: 4, label: "Valot total", value: formatedOrderTotalPrice, isHalfSized: true },
		{
			keyNumber: 5, label: "Tempo", isHalfSized: true,
			children: <ElapsedTimer
				className="text-center text-2xl sm:text-3xl"
				occupiedAt={currentTable.occupiedAt}
				showIcon={false}
			/>
		}
	]

    const routerBack = () => router.replace("/mesas")

	const showCloseOrder = () => {
		return !hideCloseOrder && user && hasAdminPermission(user.role) && currentTable.occupiedAt
	}

	return (
		<div className={style.infoCards}>
			<div className={style.topOptions}>
				<button onClick={routerBack}><IoMdArrowBack /><span>Voltar</span></button>
				{ showCloseOrder() &&
					<Link href={`/mesas/${currentTable.name}/fechar`}>Fechar conta</Link>
				}
			</div>

			<div className="text-base"></div>
			{tableOrderData.map(item => <TableOrderInfo key={item.keyNumber + item.label} {...item} />)}
		</div>
	)
}
