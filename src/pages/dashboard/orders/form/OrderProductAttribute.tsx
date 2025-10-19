import { IProductVariant } from "@/types/product.type"
import { Text } from "@mantine/core"
import { ProductVariantSelectItem } from "@/pages/dashboard/orders/components/ProductVariantSelectItem"
import { useEffect, useMemo, useState } from "react"
import classnames from "classnames"

interface Props {
  name: string
  attributeValues: { name: string; variants: IProductVariant[] }[]
  onVariantSelect: (variant?: IProductVariant) => void
  initialVariant?: IProductVariant
}

export const OrderProductAttribute = ({
  name,
  attributeValues,
  onVariantSelect,
  initialVariant,
}: Props) => {
  const hasNoAttribute = name === "N/A"
  const hasNoSize =
    hasNoAttribute &&
    attributeValues[0].variants.length <= 1 &&
    attributeValues[0].variants?.[0].size === "N/A"
  const defaultAttributeVariant = hasNoSize ? attributeValues[0].variants?.[0] : undefined

  useEffect(() => {
    if (hasNoSize) {
      onVariantSelect(defaultAttributeVariant)
    }
  }, [hasNoSize])

  const [selectedAttributeValue, setSelectedAttributeValue] = useState<string | undefined>(
    hasNoAttribute ? name : undefined,
  )
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>(
    defaultAttributeVariant?.id,
  )

  const variants = useMemo(() => {
    if (!selectedAttributeValue) return []

    const attribute = attributeValues.find((attribute) => attribute.name === selectedAttributeValue)

    if (!attribute) return []

    return attribute.variants
  }, [selectedAttributeValue])

  const handleOnSelectAttributeValue = (attributeValue: string) => {
    setSelectedAttributeValue(attributeValue)

    setSelectedVariant(undefined)
    onVariantSelect(undefined)
  }

  const handleOnVariantSelect = (variant: IProductVariant) => {
    setSelectedVariant(variant.id)
    onVariantSelect(variant)
  }

  useEffect(() => {
    if (initialVariant) {
      setSelectedAttributeValue(initialVariant.name)
      setSelectedVariant(initialVariant.id)
    }
  }, [initialVariant])

  return (
    <div
      className={classnames("flex flex-col gap-4", {
        "mt-6": !hasNoSize || !hasNoAttribute,
      })}
    >
      {name !== "N/A" && (
        <>
          <div>
            {/* Attribute Name */}
            <Text ml={2} mb={4} fz={14} fw={500}>
              {name}
            </Text>

            <div className="grid grid-cols-2 gap-2">
              {attributeValues?.map((attribute) => (
                <ProductVariantSelectItem
                  selected={selectedAttributeValue === attribute.name}
                  key={attribute.name}
                  name={attribute.name}
                  onSelect={() => handleOnSelectAttributeValue(attribute.name)}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Size */}
      {selectedAttributeValue && !hasNoSize && (
        <div>
          <Text ml={2} mb={4} fz={14} fw={500}>
            Size
          </Text>

          <div className="grid grid-cols-2 gap-2">
            {variants.map((variant) => (
              <ProductVariantSelectItem
                selected={selectedVariant === variant.id}
                name={variant.size}
                onSelect={() => handleOnVariantSelect(variant)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
