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
} from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { useNavigate, useParams } from "react-router"
import { KEY } from "@/constants/key"
import { useQuery, useMutation } from "@tanstack/react-query"
import { getProductBySlug } from "@/services/products.service"
import { createOrder } from "@/services/order.service"
import { getImage } from "@/services/media.service"
import { useContext, useEffect, useMemo, useState } from "react"
import { PRODUCT_SIZE } from "@/constants/product"
import { CartContext } from "@/contexts/CartContext"
import { AuthContext } from "@/contexts/AuthContext"
import { IconCheck, IconX, IconAlertTriangle } from "@tabler/icons-react"

const FALLBACK_IMAGE =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbrHWzlFK_PWuIk1Jglo7Avt97howljIWwAA&s"

export default function ProductPage() {
  const { slug } = useParams()
  const navigate = useNavigate()

  const { data: product } = useQuery({
    queryKey: [KEY.PRODUCTS, slug],
    queryFn: () => getProductBySlug(slug as string),
    enabled: !!slug,
  })

  const { addToCart } = useContext(CartContext)
  const { user } = useContext(AuthContext)

  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({})
  const [size, setSize] = useState<string>()
  const [price, setPrice] = useState<number>()
  const [loading, setLoading] = useState(false)

  const variants = product?.data?.productVariant ?? []

  // Group variants by attribute type (skip "N/A")
  const attributeGroups = useMemo(() => {
    const groups: Record<string, { name: string; values: string[] }> = {}

    variants.forEach((variant) => {
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
  }, [variants])

  // Auto-set user's sex when variants are loaded
  useEffect(() => {
    if (user?.student?.sex && variants.length > 0 && Object.keys(selectedAttributes).length === 0) {
      const userSex = user.student.sex.toLowerCase()

      // Find if there's a "Sex" attribute group
      const sexAttributeGroup = Object.entries(attributeGroups).find(
        ([_, group]) => group.name.toLowerCase() === "sex" || group.name.toLowerCase() === "gender",
      )

      if (sexAttributeGroup) {
        const [attributeName, attributeData] = sexAttributeGroup
        // Find matching value (case-insensitive)
        const matchingValue = attributeData.values.find((value) => value.toLowerCase() === userSex)

        if (matchingValue) {
          console.log("Auto-setting sex attribute:", attributeName, "=", matchingValue)
          setSelectedAttributes({ [attributeName]: matchingValue })
        }
      }
    }
  }, [user?.student?.sex, variants, attributeGroups, selectedAttributes])

  // Filter size options
  const sortedSizeOptions = useMemo(() => {
    if (Object.keys(selectedAttributes).length === 0 && Object.keys(attributeGroups).length > 0) {
      return []
    }

    const filteredVariants = variants.filter((v) => {
      return Object.entries(selectedAttributes).every(
        ([attrName, attrValue]) => v.name === attrValue && v.productAttribute.name === attrName,
      )
    })

    const sizes = filteredVariants.map((v) => v.size)

    // If only "N/A" size → skip size selection
    if (sizes.includes("N/A") && sizes.length === 1) {
      return []
    }

    return [...new Set(sizes.filter((s) => s && s !== "N/A"))].sort(
      (a, b) => Object.keys(PRODUCT_SIZE).indexOf(a) - Object.keys(PRODUCT_SIZE).indexOf(b),
    )
  }, [selectedAttributes, variants, attributeGroups])

  const [stock, setStock] = useState<number | null>(null)
  const [stockCondition, setStockCondition] = useState<string | null>(null)

  useEffect(() => {
    let variant: any

    if (Object.keys(selectedAttributes).length > 0 || Object.keys(attributeGroups).length === 0) {
      variant = variants.find((v) => {
        const attributeMatch = Object.entries(selectedAttributes).every(
          ([attrName, attrValue]) => v.name === attrValue && v.productAttribute.name === attrName,
        )
        return attributeMatch && (v.size === size || v.size === "N/A")
      })
    }

    setPrice(variant?.price)
    setStock(variant?.stockQuantity ?? null)
    setStockCondition(variant?.stockCondition ?? null)
  }, [selectedAttributes, size, variants, attributeGroups])

  const handleAttributeChange = (attributeName: string, value: string) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attributeName]: value,
    }))
    setSize(undefined) // Reset size when attribute changes
  }

  // Enhanced stock condition helpers
  const isOutOfStock = stockCondition === "out-of-stock"
  const isLowStock = stockCondition === "low-stock"
  const isInStock = stockCondition === "in-stock"

  const getStockDisplay = () => {
    if (!stockCondition) return null

    switch (stockCondition) {
      case "out-of-stock":
        return {
          text: "Out of stock",
          color: "red" as const,
          icon: <IconX size={16} />,
          badge: { color: "red", text: "Out of Stock" },
        }
      case "low-stock":
        return {
          text: `Low stock - Only ${stock}pc(s) remaining`,
          color: "orange" as const,
          icon: <IconAlertTriangle size={16} />,
          badge: { color: "orange", text: "Low Stock" },
        }
      case "in-stock":
        return {
          text: `${stock}pc(s) available`,
          color: "green" as const,
          icon: <IconCheck size={16} />,
          badge: { color: "green", text: "In Stock" },
        }
      default:
        return null
    }
  }

  const stockDisplay = getStockDisplay()
  const hasSizeRequirement = variants.some((v) => v.size !== "N/A")

  const canOrder = useMemo(() => {
    if (!user) return false
    if (isOutOfStock) return false

    // If there are no attribute groups (only "N/A"), skip attribute requirement
    const attributesOk =
      Object.keys(attributeGroups).length === 0 || Object.keys(selectedAttributes).length > 0

    // If all variants have size "N/A", skip size requirement
    const hasSizeNA = variants.some((v) => v.size === "N/A")
    const sizeOk = !hasSizeRequirement || size || hasSizeNA

    return attributesOk && sizeOk
  }, [user, isOutOfStock, attributeGroups, selectedAttributes, hasSizeRequirement, size, variants])

  // Check if sex selection should be hidden for logged-in users
  const shouldHideSexSelection = (attributeName: string, attributeData: any) => {
    const isSexAttribute =
      attributeData.name.toLowerCase() === "sex" || attributeData.name.toLowerCase() === "gender"
    const userHasSex = user?.student?.sex
    const sexIsAutoSelected = selectedAttributes[attributeName] && userHasSex

    return isSexAttribute && userHasSex && sexIsAutoSelected
  }

  // Add to cart with stock condition awareness
  const handleAddToCart = () => {
    if (isOutOfStock) {
      notifications.show({
        title: "Cannot Add to Cart",
        message: "This item is currently out of stock.",
        color: "red",
        icon: <IconX size={16} />,
        autoClose: 3000,
      })
      return
    }

    const variant = variants.find((v) => {
      const attributeMatch = Object.entries(selectedAttributes).every(
        ([attrName, attrValue]) => v.name === attrValue && v.productAttribute.name === attrName,
      )
      return attributeMatch && (v.size === size || v.size === "N/A")
    })

    if (!variant) return

    setLoading(true)
    addToCart(variant.id)
      .then((res) => {
        let message = res.message

        // Add low stock warning to success message
        if (res.type === "success" && isLowStock) {
          message = `${res.message} Note: This item is low in stock.`
        }

        notifications.show({
          title: res.type === "success" ? "Success" : "Error",
          message,
          color: res.type === "success" ? (isLowStock ? "orange" : "green") : "red",
          icon: res.type === "success" ? <IconCheck size={16} /> : <IconX size={16} />,
          autoClose: isLowStock ? 5000 : 3000, // Show longer for low stock warning
        })
      })
      .finally(() => setLoading(false))
  }

  // Buy now with stock condition awareness
  const buyNowMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("Missing required information")

      if (isOutOfStock) {
        throw new Error("This item is currently out of stock")
      }

      const variant = variants.find((v) => {
        const attributeMatch = Object.entries(selectedAttributes).every(
          ([attrName, attrValue]) => v.name === attrValue && v.productAttribute.name === attrName,
        )
        return attributeMatch && (v.size === size || v.size === "N/A")
      })

      if (!variant) {
        throw new Error("Selected variant not found")
      }

      const orderItems = [{ productVariantId: variant.id, quantity: 1 }]

      const result = await createOrder(user.id, orderItems, "buy-now")
      console.log("Order result:", result)
      return result
    },
    onSuccess: (order) => {
      console.log("Order in onSuccess:", order)

      let message = "Your order has been created successfully."
      let color: "green" | "orange" = "green"

      // Add low stock notice to success message
      if (isLowStock) {
        message += " Note: This item is low in stock, so please complete payment promptly."
        color = "orange"
      }

      notifications.show({
        title: "Success!",
        message,
        color,
        icon: <IconCheck size={16} />,
        autoClose: isLowStock ? 6000 : 4000,
      })

      navigate(`/order/${order?.id}?orderType=buy-now`, { state: { orderData: order } })
    },
    onError: (error: any) => {
      notifications.show({
        title: "Error",
        message: error.message || "Failed to create order. Please try again.",
        color: "red",
        icon: <IconX size={16} />,
      })
    },
  })

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
            {stockDisplay && (
              <Badge
                color={stockDisplay.badge.color}
                variant="filled"
                size="lg"
                className="absolute top-4 right-4"
                leftSection={stockDisplay.icon}
              >
                {stockDisplay.badge.text}
              </Badge>
            )}
          </div>
        </Grid.Col>

        {/* Product details */}
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Stack gap={10} w="100%" bg="#f2f5f9" px={{ base: 16, md: 0 }}>
            <Title order={3}>
              {product?.data?.name} ({product?.data.category})
            </Title>

            <Text c="dimmed">{product?.data?.description}</Text>

            <Text size="xl" fw={700}>
              <NumberFormatter prefix="₱" value={price ?? variants[0]?.price} decimalSeparator="" />
            </Text>

            <Divider />

            {/* Attribute selection */}
            {Object.entries(attributeGroups).map(([attributeName, attributeData]) => (
              <Stack key={attributeName}>
                <Title key={attributeName} order={4}>
                  {attributeData.name}
                </Title>

                {/* Show selected value for auto-selected sex */}
                {shouldHideSexSelection(attributeName, attributeData) ? (
                  <>
                    <Text size="sm">Selected: {selectedAttributes[attributeName]}</Text>
                    <Text c="dimmed" size="xs" fs="italic">
                      Note: This option is determined by your registered profile. If you wish to
                      order uniforms for a different sex, kindly visit the Proware.
                    </Text>
                  </>
                ) : (
                  <Group gap={5}>
                    {attributeData.values.map((value) => (
                      <Button
                        key={value}
                        variant={selectedAttributes[attributeName] === value ? "filled" : "light"}
                        onClick={() => handleAttributeChange(attributeName, value)}
                        disabled={isOutOfStock}
                      >
                        {value}
                      </Button>
                    ))}
                  </Group>
                )}
              </Stack>
            ))}

            {/* Size selection */}
            {sortedSizeOptions.length > 0 && (
              <>
                <Title order={4}>Size</Title>
                <Group gap={5}>
                  {sortedSizeOptions.map((option) => (
                    <Button
                      key={option}
                      variant={size === option ? "filled" : "light"}
                      onClick={() => setSize(option)}
                      miw={{ base: 60 }}
                    >
                      {PRODUCT_SIZE[option as keyof typeof PRODUCT_SIZE] || option}
                    </Button>
                  ))}
                </Group>

                {/* Enhanced stock display */}
                {stockDisplay && (
                  <Group mt="sm" gap="xs">
                    {stockDisplay.icon}
                    <Text c={stockDisplay.color} fw={isOutOfStock || isLowStock ? 600 : 400}>
                      {stockDisplay.text}
                    </Text>
                  </Group>
                )}
              </>
            )}

            {/* Actions */}
            <Group
              className="sticky bottom-0 left-0 w-full py-2 md:static md:bg-transparent md:p-0"
              mt="sm"
              grow
              justify="center"
            >
              <Button
                radius="xl"
                color="yellow"
                size="lg"
                disabled={!canOrder || loading}
                onClick={handleAddToCart}
                loading={loading}
              >
                Add to cart
              </Button>

              <Button
                radius="xl"
                size="lg"
                disabled={!canOrder}
                onClick={() => buyNowMutation.mutate()}
                loading={buyNowMutation.isPending}
              >
                Place Order
              </Button>
            </Group>
          </Stack>
        </Grid.Col>
      </Grid>
    </main>
  )
}
