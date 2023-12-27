import style from "./menuclientsoptions.module.css"
import { useTableContext } from "@/contexts/TableContext"

type ClientsOptionsSettingsProps = {
	table: RestaurantTableData
}

export function MenuClientsOptions({ table }: ClientsOptionsSettingsProps) {
	const { setRestaurantTables } = useTableContext()

	const addClient = () => {
		setRestaurantTables(currentValues =>
			currentValues.map(values => values.name == table.name ?
				{ ...values, customersQuantity: Math.max(1, values.customersQuantity + 1) }
				:
				values
			)
		)
	}

	const subtractClient = () => {
		setRestaurantTables(currentValues =>
			currentValues.map(values => values.name == table.name ?
				{ ...values, customersQuantity: Math.max(1, values.customersQuantity - 1) }
				:
				values
			)
		)
	}

	return (
		<div className={style.orderOptionsContent}>
			{table.occupiedAt && <>
				<h2 className={style.contentTitle}>Configurações de clientes</h2>
				<div className={style.buttonOptions}>
					<button onClick={subtractClient}>Diminuir</button>
					<button onClick={addClient}>Acrescentar</button>
				</div>
			</>}
			{}
		</div>
	)
}