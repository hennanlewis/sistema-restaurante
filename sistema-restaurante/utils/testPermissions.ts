const adminRole = ["admin", "gerente"]
export const hasAdminPermission = (valueToCheck: string) => adminRole.includes(valueToCheck)

const allowedRoles = ["admin", "gerente", "caixa"]
export const hasCashierPermission = (valueToCheck: string) => allowedRoles.includes(valueToCheck)