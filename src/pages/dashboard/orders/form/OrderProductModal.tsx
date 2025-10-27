import { Button, Image, Modal, ModalProps, ScrollArea, Text, Title } from "@mantine/core"
import { IProduct, IProductVariant } from "@/types/product.type"
import { getImage } from "@/services/media.service"
import { useEffect, useMemo, useState } from "react"
import QuantityInput from "@/pages/products/components/QuantityInput"
import { groupProductVariantsByAttribute } from "@/helper/groupProductVariants"
import { OrderProductAttribute } from "@/pages/dashboard/orders/form/OrderProductAttribute"

interface Props extends ModalProps {
  product?: IProduct
  initialVariant?: IProductVariant
  initialQuantity?: number
  onAddToCart: (variant: IProductVariant, quantity: number) => void
  onUpdateCart: (oldVariant: IProductVariant, variant: IProductVariant, quantity: number) => void
}

export const OrderProductModal = ({
  product,
  onClose,
  onAddToCart,
  onUpdateCart,
  initialVariant,
  initialQuantity,
  ...modalProps
}: Props) => {
  const isUpdate = useMemo(() => !!initialVariant, [initialVariant])

  const handleOnClose = () => {
    onClose()
  }

  const [variant, setVariant] = useState<IProductVariant | undefined>(initialVariant)
  const [quantity, setQuantity] = useState<number>(initialQuantity ?? 1)

  const productAttributes = groupProductVariantsByAttribute(product?.productVariant ?? [])

  const handleOnVariantSelect = (variant?: IProductVariant) => {
    setVariant(variant)
  }

  useEffect(() => {
    setVariant(initialVariant ?? undefined)
    setQuantity(initialQuantity ?? 1)
  }, [product])

  const handleOnAddToCart = () => {
    if (!variant) return

    if (isUpdate && !!initialVariant) {
      onUpdateCart(initialVariant, variant, quantity)
      return
    }

    onAddToCart(variant, quantity)
  }

  return (
    <Modal
      {...modalProps}
      withCloseButton={false}
      centered
      closeOnClickOutside={false}
      classNames={{
        body: "!p-0",
      }}
      radius={8}
      onClose={handleOnClose}
      size="lg"
    >
      <ScrollArea h={640}>
        {product && (
          <div className="px-4 py-6">
            {/*    Product Details */}
            <div className="mb-[70px] px-1 pb-4">
              <div>
                <div className="flex justify-center rounded-lg bg-neutral-100 p-4">
                  <Image
                    className="!overflow-hidden !rounded-md"
                    src={getImage(product.image)}
                    alt={product.name}
                    h={200}
                    w={200}
                  />
                </div>

                <Title order={4} mt={8}>
                  {product.name}
                </Title>

                <Text c="dimmed">{product.description}</Text>
              </div>

              {/*  Product Attributes  */}
              <div className="flex flex-col">
                {productAttributes.map((attribute) => (
                  <OrderProductAttribute
                    key={attribute.name}
                    name={attribute.name}
                    attributeValues={attribute.attributeValues}
                    onVariantSelect={handleOnVariantSelect}
                    initialVariant={initialVariant}
                  />
                ))}
              </div>

              {/* Quantity */}
              <div className="mt-6">
                <Text ml={2} mb={4} fz={14} fw={500}>
                  Quantity
                </Text>

                <QuantityInput
                  quantity={quantity}
                  setQuantity={setQuantity}
                  min={0}
                  max={variant?.stockAvailable}
                />
              </div>
            </div>

            {/* Total & Actions */}
            <div className="fixed right-0 bottom-0 left-0 border-t border-neutral-100 bg-white p-4">
              <div className="flex items-center justify-between gap-4">
                <Text fw={600}> ₱ {variant ? variant.price.toLocaleString() : "-"}</Text>
                <div className="flex gap-2">
                  <Button variant="transparent" onClick={() => handleOnClose()}>
                    Cancel
                  </Button>

                  <Button onClick={() => handleOnAddToCart()} disabled={!variant || quantity <= 0}>
                    {isUpdate ? "Update Cart" : "Add to Cart"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </ScrollArea>
    </Modal>
  )
}
