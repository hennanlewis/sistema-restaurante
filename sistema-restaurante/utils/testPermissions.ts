export const hasAdminPermission = (valueToCheck: string) => valueToCheck == "gerente"
export const hasCashierPermission = (valueToCheck: string) => valueToCheck == "gerente" || valueToCheck == "caixa"