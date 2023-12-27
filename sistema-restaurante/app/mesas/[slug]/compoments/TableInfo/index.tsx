import { ReactNode } from "react"

import style from "./tableinfo.module.css"

type OrderInfoProps = {
	label: string
	value?: string | number
	isHalfSized?: boolean
	children?: ReactNode
}

export function TableOrderInfo({
	label, value, isHalfSized = false, children
}: OrderInfoProps) {

	return (
		<div className={isHalfSized ? style.infoCardHalfSized : style.infoCard}>
			<span className={style.infoTitle}>{label}</span>
			{!children && <span className={style.infoValue}>{value}</span>}
			{children && children}
		</div>
	)
}
