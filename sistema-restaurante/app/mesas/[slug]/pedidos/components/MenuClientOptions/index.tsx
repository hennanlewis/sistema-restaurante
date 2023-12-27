import style from "./menuclientsoptions.module.css"
import { useBaseContext } from "@/contexts/MainContext"

type ClientsOptionsSettingsProps = {
	table: RestaurantTableData
}

export function MenuClientsOptions({ table }: ClientsOptionsSettingsProps) {
	const { setRestaurantTables } = useBaseContext()

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