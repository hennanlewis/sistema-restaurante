"use client"
import Link from "next/link"

import style from "./navmenu.module.css"

type NavMenuProps = {
	label: string
	url: string
}

export function NavMenu({ label, url }: NavMenuProps) {

	return (
		<div className={style.itemMenu}>
			<Link href={url} className={style.itemMenuTitle}>{label}</Link>
		</div>
	)
}
