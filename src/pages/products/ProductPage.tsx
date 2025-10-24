import {
  Button,
  Divider,
  Grid,
  Group,
  Image,
  NumberFormatter,
  Stack,
  Text,
  Title,
  Badge,
  Tooltip,
  Card,
  Space,
  SimpleGrid,
} from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { useNavigate, useParams } from "react-router"
import { KEY } from "@/constants/key"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getProductBySlug } from "@/services/products.service"
import { createOrder } from "@/services/order.service"
import { getImage } from "@/services/media.service"
import { useContext, useEffect, useMemo, useState } from "react"
import { PRODUCT_SIZE } from "@/constants/product"
import { AuthContext } from "@/contexts/AuthContext"
import { IconCheck, IconInfoCircle, IconQuestionMark, IconX } from "@tabler/icons-react"
import QuantityInput from "./components/QuantityInput"
import { addItem } from "@/services/cart.service"
import OrderConfirmationModal from "../cart/components/OrderConfirmationModal"
import { useDisclosure } from "@mantine/hooks"
import { notifyResponseError } from "@/helper/errorNotification"
import { AxiosError } from "axios"

const FALLBACK_IMAGE =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbrHWzlFK_PWuIk1Jglo7Avt97howljIWwAA&s"

export default function ProductPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: product } = useQuery({
    queryKey: [KEY.PRODUCTS, slug],
    queryFn: () => getProductBySlug(slug as string),
    enabled: !!slug,
  })
  const { user } = useContext(AuthContext)

  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({})
  const [size, setSize] = useState<string | undefined>(undefined)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)

  const [confirmationOpened, { open: openConfirmation, close: closeConfirmation }] =
    useDisclosure(false)

  // Consolidated product data logic
  const productData = useMemo(() => {
    const variants = product?.data?.productVariant ?? []
    const hasNoVariants = variants.length === 0
    const baseVariant = variants[0]

    return {
      variants,
      hasNoVariants,
      basePrice: baseVariant?.price,
      baseStock: baseVariant?.stockAvailable,
      baseStockCondition: baseVariant?.stockCondition,
    }
  }, [product?.data?.productVariant])

  // Group variants by attribute type (consolidated logic)
  const attributeGroups = useMemo(() => {
    if (productData.hasNoVariants) return {}

    const groups: Record<string, { name: string; values: string[] }> = {}

    productData.variants.forEach((variant) => {
      const attrName = variant.productAttribute.name
      const attrValue = variant.name

      if (attrName === "N/A" || attrValue === "N/A") return

      if (!groups[attrName]) {
        groups[attrName] = { name: attrName, values: [] }
      }

      if (!groups[attrName].values.includes(attrValue)) {
        groups[attrName].values.push(attrValue)
      }
    })

    return groups
  }, [productData.variants, productData.hasNoVariants])

  // Auto-set default attributes when variants are loaded
  useEffect(() => {
    if (
      productData.hasNoVariants ||
      productData.variants.length === 0 ||
      Object.keys(selectedAttributes).length > 0 ||
      Object.keys(attributeGroups).length === 0
    )
      return

    const defaultAttributes: Record<string, string> = {}

    Object.entries(attributeGroups).forEach(([attributeName, attributeData]) => {
      // Skip if no values available
      if (!attributeData.values || attributeData.values.length === 0) return

      const isSexAttribute =
        attributeData.name.toLowerCase() === "sex" || attributeData.name.toLowerCase() === "gender"

      if (isSexAttribute && user?.student?.sex) {
        // Auto-select based on user's sex
        const userSex = user.student.sex.toLowerCase()
        const matchingValue = attributeData.values.find((value) => value.toLowerCase() === userSex)
        if (matchingValue) {
          defaultAttributes[attributeName] = matchingValue
        } else {
          // Fallback to first value if user's sex doesn't match
          defaultAttributes[attributeName] = attributeData.values[0]
        }
      } else {
        // For all other attributes, select the first value
        defaultAttributes[attributeName] = attributeData.values[0]
      }
    })

    if (Object.keys(defaultAttributes).length > 0) {
      setSelectedAttributes(defaultAttributes)
    }
  }, [
    user?.student?.sex,
    productData.variants,
    attributeGroups,
    selectedAttributes,
    productData.hasNoVariants,
  ])

  // Filter size options (simplified)
  const sortedSizeOptions = useMemo(() => {
    if (
      productData.hasNoVariants ||
      (Object.keys(selectedAttributes).length === 0 && Object.keys(attributeGroups).length > 0)
    ) {
      return []
    }

    const filteredVariants = productData.variants.filter((v) =>
      Object.entries(selectedAttributes).every(
        ([attrName, attrValue]) => v.name === attrValue && v.productAttribute.name === attrName,
      ),
    )

    const sizes = [...new Set(filteredVariants.map((v) => v.size).filter((s) => s && s !== "N/A"))]

    return sizes.sort(
      (a, b) => Object.keys(PRODUCT_SIZE).indexOf(a) - Object.keys(PRODUCT_SIZE).indexOf(b),
    )
  }, [selectedAttributes, productData.variants, attributeGroups, productData.hasNoVariants])

  // Auto-select first size when size options change
  useEffect(() => {
    if (sortedSizeOptions.length > 0 && !size) {
      setSize(sortedSizeOptions[0])
    }
  }, [sortedSizeOptions, size])

  // Consolidated variant and pricing logic
  const currentVariant = useMemo(() => {
    if (productData.hasNoVariants) {
      return {
        price: productData.basePrice,
        stock: productData.baseStock,
        stockCondition: productData.baseStockCondition,
      }
    }

    if (Object.keys(selectedAttributes).length === 0 && Object.keys(attributeGroups).length > 0) {
      return { price: undefined, stock: null, stockCondition: null }
    }

    const variant = productData.variants.find((v) => {
      const attributeMatch = Object.entries(selectedAttributes).every(
        ([attrName, attrValue]) => v.name === attrValue && v.productAttribute.name === attrName,
      )
      return attributeMatch && (v.size === size || v.size === "N/A")
    })

    return {
      price: variant?.price,
      stock: variant?.stockAvailable ?? null,
      stockCondition: variant?.stockCondition ?? null,
    }
  }, [selectedAttributes, size, productData, attributeGroups])

  const handleAttributeChange = (attributeName: string, value: string) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attributeName]: value,
    }))
    setSize(undefined)
  }

  // Stock condition helpers (consolidated)
  const stockStatus = {
    isOutOfStock: currentVariant.stockCondition === "out-of-stock",
    isLowStock: currentVariant.stockCondition === "low-stock",
    isInStock: currentVariant.stockCondition === "in-stock",
  }

  // Simplified canOrder logic - let backend handle stock validation
  // const canOrder = useMemo(() => {
  //   if (productData.hasNoVariants) return true

  //   const attributesOk =
  //     Object.keys(attributeGroups).length === 0 || Object.keys(selectedAttributes).length > 0
  //   const hasSizeRequirement = productData.variants.some((v) => v.size !== "N/A")
  //   const sizeOk = !hasSizeRequirement || size || productData.variants.some((v) => v.size === "N/A")

  //   return attributesOk && sizeOk
  // }, [user, attributeGroups, selectedAttributes, size, productData])

  // Auto-limit quantity for low stock items
  useEffect(() => {
    if (stockStatus.isLowStock && quantity > 1) {
      setQuantity(1)
    }
  }, [stockStatus.isLowStock, quantity])

  // Helper function for notifications
  const showNotification = (
    title: string,
    message: string,
    type: "success" | "error" | "warning" = "success",
  ) => {
    const config = {
      success: { color: "green", icon: <IconCheck size={16} />, autoClose: 3000 },
      error: { color: "red", icon: <IconX size={16} />, autoClose: 3000 },
      warning: { color: "orange", icon: <IconCheck size={16} />, autoClose: 5000 },
    }

    notifications.show({
      title,
      message,
      ...config[type],
    })
  }

  // Helper function to get selected variant/product ID
  const getSelectedItem = () => {
    if (productData.hasNoVariants) {
      return { type: "product", id: product?.data?.id }
    }

    const variant = productData.variants.find((v) => {
      const attributeMatch = Object.entries(selectedAttributes).every(
        ([attrName, attrValue]) => v.name === attrValue && v.productAttribute.name === attrName,
      )
      return attributeMatch && (v.size === size || v.size === "N/A")
    })

    return { type: "variant", id: variant?.id }
  }

  // Simplified handleOnAddToCart - remove redundant checks
  const handleOnAddToCart = async () => {
    if (!user) {
      navigate("/auth")
      showNotification("Login required", "Please log in to add items to cart.", "warning")
      return
    }

    setLoading(true)

    try {
      const selectedItem = getSelectedItem()

      if (!selectedItem.id) {
        showNotification("Error", "Please select all required options.", "error")
        return
      }

      const response = await addItem(user.id, selectedItem.id, quantity)

      queryClient.invalidateQueries({ queryKey: ["cart", user.id] })

      showNotification("Success", response.message, "success")
    } catch (error: any) {
      showNotification(
        "Error",
        error.response?.data?.error || "Failed to add item to cart",
        "error",
      )
    } finally {
      setLoading(false)
    }
  }

  // Simplified buyNowMutation - remove redundant validations
  const buyNowMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Please log in to place an order")

      const selectedItem = getSelectedItem()

      if (!selectedItem.id) throw new Error("Please select all required options")

      const orderItems = [{ productVariantId: selectedItem.id, quantity }]

      return await createOrder(user.id, orderItems, "buy-now")
    },
    onSuccess: (order) => {
      showNotification("Success!", order.message)
      navigate(`/order/${order?.data.id}?orderType=buy-now`)
    },
    onError: (error: AxiosError<{ message: string; error: string | any[] }>) => {
      notifyResponseError(error, "Order", "create")
    },
  })

  const handleConfirmBuyNow = () => {
    buyNowMutation.mutate()
    closeConfirmation()
  }

  const buyNowItem = useMemo(() => {
    if (!product?.data || !currentVariant.price) return undefined

    return {
      productName: product.data.name,
      productImage: product.data.image,
      price: currentVariant.price,
      quantity: quantity,
      size: size !== "N/A" ? size : undefined,
      attributes: Object.keys(selectedAttributes).length > 0 ? selectedAttributes : undefined,
    }
  }, [product?.data, currentVariant.price, quantity, size, selectedAttributes])

  // Check if sex selection should be hidden for logged-in users
  const shouldHideSexSelection = (attributeName: string, attributeData: any) => {
    const isSexAttribute =
      attributeData.name.toLowerCase() === "gender" || attributeData.name.toLowerCase() === "sex"
    const userHasSex = user?.student?.sex
    const sexIsAutoSelected = selectedAttributes[attributeName] && userHasSex

    return isSexAttribute && userHasSex && sexIsAutoSelected
  }

  return (
    <main className="relative mx-auto max-w-[1200px]">
      <Grid
        gutter={{ base: "xl", sm: "sm", md: "lg", lg: "xl" }}
        mt={{ base: 0, sm: "xl" }}
        px={{ sm: "xl", xl: 0 }}
      >
        {/* Product image */}
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <div className="relative">
            <Image
              src={getImage(product?.data?.image ?? FALLBACK_IMAGE)}
              alt={product?.data?.name}
              w="100%"
              className="sm:!rounded-xl"
              loading="lazy"
              fallbackSrc={FALLBACK_IMAGE}
            />

            {/* Stock badge overlay */}
            {/* {currentVariant.stock !== null && (
              <Badge variant="filled" size="lg" className="absolute top-4 right-4">
                {currentVariant.stockCondition}
              </Badge>
            )} */}
          </div>
        </Grid.Col>

        {/* Product details */}
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Group gap={6} mb="xs">
            <Badge color="gray">{product?.data?.category}</Badge>
            <Badge color="gray">{product?.data.department.acronym}</Badge>
          </Group>
          <Stack gap="md" w="100%" bg="#f2f5f9" px={{ base: 16, md: 0 }}>
            {/* Description */}
            <div className="gap-2">
              <Title order={3}>{product?.data?.name}</Title>

              <Text c="dimmed">{product?.data?.description}</Text>
            </div>

            {/* Price */}
            <Text size="xl" fw={700}>
              <NumberFormatter
                prefix="₱ "
                value={
                  (currentVariant.price ??
                    productData.basePrice ??
                    productData.variants[0]?.price) * quantity
                }
                thousandSeparator=","
                decimalSeparator="."
                decimalScale={2}
                fixedDecimalScale
              />
            </Text>

            <Divider />

            {/* Only show attribute selection if product has variants */}
            {!productData.hasNoVariants &&
              Object.entries(attributeGroups).map(([attributeName, attributeData]) => (
                <Stack gap={2} key={attributeName}>
                  <Group gap={4} align="center">
                    <Text fw="bold" tt="uppercase">
                      {" "}
                      {attributeData.name}:{" "}
                    </Text>

                    <Text key={attributeName} tt="uppercase">
                      <span className="text-sm font-bold text-gray-500">
                        {selectedAttributes[attributeName]}
                      </span>
                    </Text>

                    <Tooltip
                      multiline={true}
                      w={250}
                      label="  Note: This option is determined by your registered profile. If you wish to
                      order uniforms for a different sex, kindly visit the Proware."
                    >
                      <IconInfoCircle size={16} color="#228BE6" />
                    </Tooltip>
                  </Group>

                  <Space h="xs" />

                  {/* Show selected value for auto-selected sex */}
                  {shouldHideSexSelection(attributeName, attributeData) ? (
                    <Text c="dimmed" size="xs" fs="italic"></Text>
                  ) : (
                    <>
                      {!selectedAttributes[attributeName] && (
                        <Text size="sm" c="dimmed" fs="italic">
                          Please select a {attributeData.name.toLowerCase()}
                        </Text>
                      )}
                      <Group gap={5}>
                        {attributeData.values.map((value) => (
                          <Button
                            key={value}
                            variant={
                              selectedAttributes[attributeName] === value ? "filled" : "light"
                            }
                            onClick={() => handleAttributeChange(attributeName, value)}
                          >
                            {value}
                          </Button>
                        ))}
                      </Group>
                    </>
                  )}
                </Stack>
              ))}

            {/* Size selection - only for products with variants */}
            {!productData.hasNoVariants && sortedSizeOptions.length > 0 && (
              <>
                <Text fw="bold" tt="uppercase">
                  Size: <span className="text-sm font-bold text-gray-500">{size && size}</span>
                </Text>
                <SimpleGrid cols={{ base: 4, sm: 5 }} spacing={5} maw={350}>
                  {sortedSizeOptions.map((option) => (
                    <Button
                      key={option}
                      variant={size === option ? "filled" : "light"}
                      onClick={() => setSize(option)}
                    >
                      {PRODUCT_SIZE[option as keyof typeof PRODUCT_SIZE] || option}
                    </Button>
                  ))}
                </SimpleGrid>
              </>
            )}

            {/* Stock display */}
            {currentVariant.stock !== null && currentVariant.stockCondition && (
              <Text
                fw={stockStatus.isOutOfStock || stockStatus.isLowStock ? 600 : 400}
                c={stockStatus.isOutOfStock ? "red" : stockStatus.isLowStock ? "orange" : "dark"}
              >
                {currentVariant.stock} stock available
                {stockStatus.isOutOfStock && " (Out of Stock)"}
                {stockStatus.isLowStock && " (Low Stock)"}
              </Text>
            )}

            {/* Quantity Input */}
            <>
              <Text fw="bold" tt="uppercase">
                Quantity:
              </Text>
              <QuantityInput
                quantity={quantity}
                setQuantity={setQuantity}
                disabled={stockStatus.isOutOfStock}
              />
              {stockStatus.isLowStock && (
                <Text size="xs" c="orange" fs="italic">
                  Limited to 1 item due to low stock
                </Text>
              )}
            </>

            {/* Action Buttons */}
            <Group
              className="sticky bottom-0 left-0 w-full py-2 md:static md:bg-transparent md:p-0"
              mt="sm"
              grow
              justify="center"
            >
              <Tooltip label="Add this item to your cart for later checkout">
                <Button
                  radius="xl"
                  color="yellow"
                  size="lg"
                  onClick={handleOnAddToCart}
                  loading={loading}
                  // disabled={!canOrder}
                >
                  Add to cart
                </Button>
              </Tooltip>

              <Tooltip label="Proceed to order this item now">
                <Button
                  radius="xl"
                  size="lg"
                  // disabled={!canOrder || stockStatus.isOutOfStock}
                  disabled={stockStatus.isOutOfStock}
                  onClick={
                    !user
                      ? () => {
                          navigate("/auth")

                          showNotification(
                            "Login required",
                            "Please log in to buy items.",
                            "warning",
                          )
                        }
                      : openConfirmation
                  }
                  loading={buyNowMutation.isPending}
                >
                  Buy Now
                </Button>
              </Tooltip>
            </Group>
          </Stack>
        </Grid.Col>
      </Grid>
      <OrderConfirmationModal
        opened={confirmationOpened}
        onClose={closeConfirmation}
        buyNowItem={buyNowItem}
        onConfirm={handleConfirmBuyNow}
        isLoading={buyNowMutation.isPending}
        title="Confirm Purchase"
        warningMessage={
          stockStatus.isLowStock
            ? "This item is low in stock. Please confirm your order promptly."
            : "Please review your order before confirming."
        }
      />
    </main>
  )
}
