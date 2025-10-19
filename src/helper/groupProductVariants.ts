import { IProductVariant } from "@/types/product.type"

export function groupProductVariantsByAttribute(variants: IProductVariant[]) {
  const attributeMap = new Map<
    string,
    { name: string; attributeValues: { name: string; variants: IProductVariant[] }[] }
  >()

  for (const variant of variants) {
    const attrName = variant.productAttribute?.name ?? "Unknown"
    const attrValue = variant.name ?? "Unknown"

    if (!attributeMap.has(attrName)) {
      attributeMap.set(attrName, { name: attrName, attributeValues: [] })
    }

    const attributeGroup = attributeMap.get(attrName)!
    let valueGroup = attributeGroup.attributeValues.find((v) => v.name === attrValue)

    if (!valueGroup) {
      valueGroup = { name: attrValue, variants: [] }
      attributeGroup.attributeValues.push(valueGroup)
    }

    valueGroup.variants.push(variant)
  }

  return Array.from(attributeMap.values())
}
