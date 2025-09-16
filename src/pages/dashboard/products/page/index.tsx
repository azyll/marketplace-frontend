import { Box, Button, Card, Container, LoadingOverlay, Space, Text, Title } from "@mantine/core"
import { Ref, useEffect, useMemo, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { ROUTES } from "@/constants/routes"
import { KEY } from "@/constants/key"
import { getProductBySlug } from "@/services/products.service"
import {
  ProductDetailsForm,
  ProductDetailsFormRef,
} from "@/pages/dashboard/products/page/ProductDetailsForm"
import {
  MultipleVariantForm,
  MultipleVariantFormRef,
} from "@/pages/dashboard/products/page/MultipleVariantForm"
import {
  SingleVariantForm,
  SingleVariantFormRef,
} from "@/pages/dashboard/products/page/SingleVariantForm"
import { ICreateProductVariantInput, IProductAttribute } from "@/types/product.type"
import { getProductAttributes } from "@/services/product-attribute.service"
import { getImage } from "@/services/media.service"

export const ProductPage = () => {
  const { productId } = useParams<{ productId: string }>()

  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const isCreate = useMemo(() => productId === "create", [productId])
  const isUpdate = useMemo(() => !!productId && productId !== "create", [productId])

  const handleOnCancel = () => {
    navigate(ROUTES.DASHBOARD.PRODUCTS.BASE)
  }

  const { data: product, isLoading } = useQuery({
    queryKey: [KEY.PRODUCT, productId],
    queryFn: () => getProductBySlug(productId ?? ""),
    enabled: isUpdate,
    select: (response) => response.data,
  })

  const { data: naAttribute, isLoading: isAttributesLoading } = useQuery({
    queryKey: [KEY.PRODUCT_ATTRIBUTES],
    queryFn: () => getProductAttributes(),
    select: (attributes: IProductAttribute[]) => attributes.find(({ name }) => name === "N/A"),
  })

  const isFormSubmitting = useMemo(() => {
    return false
  }, [])

  const [simpleProduct, setSimpleProduct] = useState<boolean>(true)
  const [imageDefaultValue, setImageDefaultValue] = useState<string>()

  const productDetailsFormRef = useRef<ProductDetailsFormRef>(null)
  const singleVariantFormRef = useRef<SingleVariantFormRef>(null)
  const multipleVariantFormRef = useRef<MultipleVariantFormRef>(null)

  const handleOnSubmit = () => {
    console.log("productDetailsFormRef", productDetailsFormRef.current?.form.values)
    console.log("singleVariantFormRef", singleVariantFormRef.current?.form.values)
    console.log("multipleVariantFormRef", multipleVariantFormRef.current?.form.values)
  }

  const initializeProductDetails = () => {
    if (product) {
      productDetailsFormRef.current?.form.setInitialValues({
        name: product?.name,
        type: product.type,
        category: product.category,
        departmentId: product.departmentId,
        description: product.description,
      })

      setImageDefaultValue(getImage(product.image))

      productDetailsFormRef.current?.form.reset()
    }
  }

  const initializeProductVariants = () => {
    let isSimple = true

    if (product) {
      if (product && product?.productVariant[0]) {
        const variant = product?.productVariant[0]

        if (
          variant &&
          (variant.size !== "N/A" || variant.name !== "N/A") &&
          product?.productVariant.length > 1
        ) {
          setSimpleProduct(false)
          isSimple = false
        } else {
          setSimpleProduct(true)
          isSimple = true
        }
      }
      if (isSimple) {
        const variant = product?.productVariant?.[0]
        singleVariantFormRef.current?.form.setInitialValues({
          variants: [
            {
              productAttributeId: variant.productAttributeId,
              size: variant.size,
              price: variant.price,
              name: variant.name,
              stockAvailable: variant.stockAvailable,
            },
          ],
        })
        singleVariantFormRef.current?.form.reset()
      } else {
        const variants = product?.productVariant ?? []
        multipleVariantFormRef.current?.form.setInitialValues({
          variants: variants.map((variant) => ({
            productAttributeId: variant.productAttributeId,
            size: variant.size,
            price: variant.price,
            name: variant.name,
            stockAvailable: variant.stockAvailable,
          })),
        })
        multipleVariantFormRef.current?.form.reset()

        console.log(
          variants.map((variant) => ({
            productAttributeId: variant.productAttributeId,
            size: variant.size,
            price: variant.price,
            name: variant.name,
            stockAvailable: variant.stockAvailable,
          })),
        )
      }
    }
  }

  useEffect(() => {
    initializeProductDetails()
    initializeProductVariants()
  }, [product])

  return (
    <div>
      <Card pos="relative">
        <LoadingOverlay visible={isLoading} zIndex={1000} />

        <Card.Section p={24}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <Title order={3}>{isCreate ? "Create" : "Edit"} Product</Title>

              <Text c="dimmed">
                {isCreate ? "Create a new product" : "Modify existing product information."}
              </Text>
            </div>

            <div className="flex gap-2">
              <Button variant="light" onClick={() => handleOnCancel()} disabled={isFormSubmitting}>
                Cancel
              </Button>

              <Button
                disabled={isLoading}
                onClick={() => handleOnSubmit()}
                loading={isFormSubmitting}
              >
                Save
              </Button>
            </div>
          </div>
        </Card.Section>

        <Card.Section p={24}>
          <ProductDetailsForm ref={productDetailsFormRef} imageDefaultValue={imageDefaultValue} />
        </Card.Section>
      </Card>
      <Space h={24} />

      <div className="flex justify-between gap-4">
        <div className="flex gap-4">
          <Button
            variant={simpleProduct ? "filled" : "outline"}
            onClick={() => setSimpleProduct(true)}
            disabled={isLoading}
          >
            Simple Product
          </Button>
          <Button
            variant={!simpleProduct ? "filled" : "outline"}
            onClick={() => setSimpleProduct(false)}
            disabled={isLoading}
          >
            Multi-Variant Product
          </Button>
        </div>
      </div>

      <Space h={16} />

      <div className="relative">
        <LoadingOverlay visible={isLoading} zIndex={1000} />

        <div className={simpleProduct ? "block" : "hidden"}>
          <SingleVariantForm ref={singleVariantFormRef} />
        </div>

        <div className={simpleProduct ? "hidden" : "block"}>
          <MultipleVariantForm ref={multipleVariantFormRef} />
        </div>
      </div>
    </div>
  )
}
