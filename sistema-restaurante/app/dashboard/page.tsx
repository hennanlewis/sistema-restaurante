import { NavMenu } from "./components/NavMenu"
import style from "./dashboard.module.css"

export default function Dashboard() {

	const menuOptions = [
		{ keyNumber: 1, label: "Pedidos", url: "/mesas", permission: true },
		{ keyNumber: 2, label: "Relatórios", url: "/relatorios", permission: true },
		{ keyNumber: 3, label: "Cadastrar mesa", url: "/registrar-info", permission: true },
		{ keyNumber: 4, label: "Cadastrar funcionário", url: "/registrar-info", permission: true },
	]

	return (
		<main className={style.main}>
			<div className="text-base"></div>
			{menuOptions.map(option =>
				<NavMenu
					key={option.keyNumber + option.label}
					label={option.label}
					url={option.url}
					permissions={option.permission}
				/>
			)}
		</main>
	)
}
