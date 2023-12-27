"use client"
import { IoMdArrowBack } from "react-icons/io"
import { useParams, useRouter } from "next/navigation"
import { currencyFormater, str2Slug, sumArrayValues } from "@/utils/dataFormater"
import { ElapsedTimer } from "@/app/restaurante/components/ElapserTime"
import { useTableContext } from "@/contexts/TableContext"

import { TableOrderInfo } from "../TableInfo"
import style from "./topinfo.module.css"

export default function TopInfo() {
	const { orders, restaurantTables } = useTableContext()
	const router = useRouter()
	const params = useParams()

	const [currentTable] = restaurantTables.filter(item => item.name == params.slug)
	const filteredOrders = orders
		.filter(item => item.itemQuantity > 0 && item.tableID == currentTable.name)
	const processedOrders = filteredOrders.filter(item => item.isFinished == true)

	const orderTotalPrice = sumArrayValues(processedOrders.map(item => item.itemQuantity * item.price))
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

	const routerBack = () => router.back()
	const finish = () => router.back()

	return (
		<div className={style.infoCards}>
			<div className={style.topOptions}>
				<button onClick={routerBack}><IoMdArrowBack /><span>Voltar</span></button>
				<button onClick={finish}>Finalizar pedidos</button>
			</div>

			<div className="text-base"></div>
			{tableOrderData.map(item => <TableOrderInfo key={item.keyNumber + item.label} {...item} />)}
		</div>
	)
}
