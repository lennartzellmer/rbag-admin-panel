// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const excludeKey = <T extends object, U extends keyof any>(obj: T, key: U) => {
  const { [key]: _, ...newObj } = obj
  return newObj
}
