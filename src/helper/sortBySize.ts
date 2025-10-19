const sizeOrder = [
  "Small",
  "Medium",
  "Large",
  "Extra Large",
  "2 Extra Large",
  "3 Extra Large",
  "4 Extra Large",
  "Two Extra Large",
  "N/A",
]

export const sortVariantsBySize = <T extends { size: string }>(variants: T[]): T[] => {
  return [...variants].sort((a, b) => {
    const indexA = sizeOrder.indexOf(a.size)
    const indexB = sizeOrder.indexOf(b.size)

    // If size not found in order array, put it at the end
    const orderA = indexA === -1 ? 999 : indexA
    const orderB = indexB === -1 ? 999 : indexB

    return orderA - orderB
  })
}
