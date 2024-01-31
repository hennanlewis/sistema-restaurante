import { MenuSection } from "../MenuSection"
import style from "../../mesas.module.css"

type MenuOptionsProps = {
    menuSections: MenuSection[]
    table: RestaurantTableData
}

export function MenuOptions({ menuSections, table }: MenuOptionsProps) {

    return <>
        <h2 className={style.contentTitle}>Menu</h2>
        <div className={style.content}>
            {menuSections.map(item =>
                <MenuSection
                    key={item.menuSectionId}
                    tableID={table.name}
                    sectionName={item.name}
                    menuSectionId={item.menuSectionId}
                    options={item.options}
                />
            )}
        </div>
    </>
}