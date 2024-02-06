"use client"
import { Signika } from "next/font/google"
import { MouseEvent, useState } from "react"

import { ItemOption } from "../ItemOption"
import style from "./menusection.module.css"
import { useBaseContext } from "@/contexts/MainContext"

const signika = Signika({ subsets: ["latin"], variable: "--font-signika" })

type MenuSectionProps = {
    sectionName: string
    menuSectionId: string
    options: MenuItem[]
    tableID: string
}

export function MenuSection({ sectionName, options, tableID, menuSectionId }: MenuSectionProps) {
    const [isOpened, setIsOpened] = useState(false)
    const focusedOption = (event: MouseEvent<HTMLElement>) => {
        if (isOpened) event.currentTarget.blur()
        setIsOpened(!isOpened)
    }

    const { incrementalHexNumber } = useBaseContext()

    return (
        <div className={`${signika.className} ${style.optionsDetails}`}>
            <button
                className={isOpened ? `${style.focusedOption} ${style.optionsTitle}` : style.optionsTitle}
                onClick={focusedOption}>{sectionName}
            </button>
            <div className={style.optionsGrid}>
                {options.map(menuItem => {
                    const keyOrderID = incrementalHexNumber() + menuItem.dishId

                    return <ItemOption
                        key={keyOrderID}
                        tableID={tableID}
                        menuSectionId={menuSectionId}
                        dishId={menuItem.dishId}
                        dishName={menuItem.dishName}
                        dishPrice={menuItem.dishPrice}
                        servingsCount={menuItem.servingsCount}
                        subtext={menuItem.subtext}
                        sectionName={sectionName}
                    />
                })}
            </div>
        </div>
    )
}
