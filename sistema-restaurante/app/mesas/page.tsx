import { TableHead } from "./components/TableHead"
import { TableBody } from "./components/TableBody"

import style from "./restaurante.module.css"

export default function Home() {

	return (
		<main className={style.main}>
			<div className={style.table}>
				<TableHead />
				<TableBody />
				{/* <div className={style.orders}>
					{currencyFormater(restaurantTables
						.reduce((sum, restaurantTable) => sum += restaurantTable.orderValue, 0)
					)}
				</div> */}
			</div>
		</main>
	)
}
