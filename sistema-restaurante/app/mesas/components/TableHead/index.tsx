import { useBaseContext } from "@/contexts/MainContext"
import style from "./tablehead.module.css"
import { hasAdminPermission } from "@/utils/testPermissions"

export function TableHead() {
	const { user } = useBaseContext()

	return (
		<div className={user && hasAdminPermission(user.role) ? style.listHead2 : style.listHead}>
			<span>Mesa</span>
			{user && hasAdminPermission(user.role) && <span>Valor</span>}
			<span>Itens</span>
			<span>Clientes</span>
			<span>Ocupação</span>
		</div>

	)
}
