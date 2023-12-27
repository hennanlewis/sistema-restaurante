import style from "./tablehead.module.css"

export function TableHead() {

	return (
		<div className={style.listHead}>
			<span>Mesa</span>
			<span>Valor</span>
			<span>Itens</span>
			<span>Clientes</span>
			<span>Ocupação</span>
		</div>

	)
}
