import { Box, Button, Card, Container, LoadingOverlay, Space, Text, Title } from "@mantine/core"
import { Ref, useEffect, useMemo, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ROUTES } from "@/constants/routes"
import { KEY } from "@/constants/key"
import { createProduct, getProductBySlug, updateProduct } from "@/services/products.service"
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
import {
  ICreateProductInput,
  ICreateProductVariantInput,
  IProductAttribute,
  IUpdateProductInput,
  IUpdateProductVariantInput,
} from "@/types/product.type"
import { getProductAttributes } from "@/services/product-attribute.service"
import { getImage } from "@/services/media.service"
import { notifications } from "@mantine/notifications"
import { AxiosError } from "axios"
import { notifyResponseError } from "@/helper/errorNotification"
import { getLoggedInUser } from "@/services/user.service"

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

  const [simpleProduct, setSimpleProduct] = useState<boolean>(true)
  const [imageDefaultValue, setImageDefaultValue] = useState<string>()

  const productDetailsFormRef = useRef<ProductDetailsFormRef>(null)
  const singleVariantFormRef = useRef<SingleVariantFormRef>(null)
  const multipleVariantFormRef = useRef<MultipleVariantFormRef>(null)

  const createMutation = useMutation({
    mutationFn: (payload: ICreateProductInput) => createProduct(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY.PRODUCTS] })
      notifications.show({
        title: "Create Success",
        message: "Successfully Created Product",
        color: "green",
      })
      navigate(ROUTES.DASHBOARD.PRODUCTS.BASE)
    },
    onError: (error: AxiosError<{ message: string; error: string | any[] }>) => {
      notifyResponseError(error, "Product", "create")
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ productId, payload }: { payload: IUpdateProductInput; productId: string }) =>
      updateProduct(productId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY.PRODUCTS] })
      queryClient.invalidateQueries({ queryKey: [KEY.PRODUCT, productId] })
      notifications.show({
        title: "Update Success",
        message: "Successfully Updated Product",
        color: "green",
      })
      navigate(ROUTES.DASHBOARD.PRODUCTS.BASE)
    },
    onError: (error: AxiosError<{ message: string; error: string | any[] }>) => {
      notifyResponseError(error, "Product", "update")
    },
  })

  const isFormSubmitting = useMemo(
    () => createMutation.isPending || updateMutation.isPending,
    [createMutation.isPending, updateMutation.isPending],
  )

  const validateForms = () => {
    const productDetailsForm = productDetailsFormRef.current?.form
    const singleVariantForm = singleVariantFormRef.current?.form
    const multipleVariantForm = multipleVariantFormRef.current?.form

    if (!productDetailsForm || !singleVariantForm || !multipleVariantForm) return

    const { hasErrors: productDetailsHasErrors } = productDetailsForm.validate()

    const { hasErrors: variantHasErrors } = simpleProduct
      ? singleVariantForm.validate()
      : multipleVariantForm.validate()

    return productDetailsHasErrors || variantHasErrors
  }

  const handleOnSubmit = () => {
    const productDetailsForm = productDetailsFormRef.current?.form
    const singleVariantForm = singleVariantFormRef.current?.form
    const multipleVariantForm = multipleVariantFormRef.current?.form

    if (!productDetailsForm || !singleVariantForm || !multipleVariantForm) return
    KEY.ANNOUNCEMENTS
    const hasErrors = validateForms()

    if (!hasErrors) {
      if (isCreate) {
        const productDetails = productDetailsForm.values as ICreateProductInput
        const singleProductVariants = singleVariantForm.values
          .variants as ICreateProductVariantInput[]
        const multipleProductVariants = multipleVariantForm.values
          .variants as ICreateProductVariantInput[]

        createMutation.mutate({
          ...productDetails,
          variants: simpleProduct ? singleProductVariants : multipleProductVariants,
        })
      } else {
        const productDetails = productDetailsForm.values as IUpdateProductInput
        const singleProductVariants = singleVariantForm.values
          .variants as IUpdateProductVariantInput[]
        const multipleProductVariants = multipleVariantForm.values
          .variants as IUpdateProductVariantInput[]

        const payloadVariants = simpleProduct ? singleProductVariants : multipleProductVariants

        updateMutation.mutate({
          productId: product?.id as string,
          payload: {
            ...productDetails,
            variants: payloadVariants.map((variant, index) => {
              if (!variant.id) {
                return { ...variant, id: index }
              }
              return variant
            }) as IUpdateProductVariantInput[],
          },
        })
      }
    }
  }

  const initializeProductDetails = () => {
    if (product) {
      productDetailsFormRef.current?.form.setInitialValues({
        name: product?.name,
        type: product.type,
        category: product.category,
        level: product.level,
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
              id: variant?.id,
              productAttributeId: variant.productAttributeId,
              size: variant.size,
              price: variant.price,
              name: variant.name,
              stockQuantity: variant.stockQuantity,
            },
          ],
        })
        singleVariantFormRef.current?.form.reset()
      } else {
        const variants = product?.productVariant ?? []
        multipleVariantFormRef.current?.form.setInitialValues({
          variants: variants.map((variant) => ({
            id: variant.id,
            productAttributeId: variant.productAttributeId,
            size: variant.size,
            price: variant.price,
            name: variant.name,
            stockQuantity: variant.stockQuantity,
          })),
        })
        multipleVariantFormRef.current?.form.reset()
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
          <ProductDetailsForm
            ref={productDetailsFormRef}
            imageDefaultValue={imageDefaultValue}
            disabled={isFormSubmitting}
          />
        </Card.Section>
      </Card>
      <Space h={24} />

      <div className="flex justify-between gap-4">
        <div className="flex gap-4">
          <Button
            variant={simpleProduct ? "filled" : "outline"}
            onClick={() => setSimpleProduct(true)}
            disabled={isLoading || isFormSubmitting}
          >
            Simple Product
          </Button>
          <Button
            variant={!simpleProduct ? "filled" : "outline"}
            onClick={() => setSimpleProduct(false)}
            disabled={isLoading || isFormSubmitting}
          >
            Multi-Variant Product
          </Button>
        </div>
      </div>

      <Space h={16} />

      <div className="relative">
        <LoadingOverlay visible={isLoading} zIndex={1000} />

        <div className={simpleProduct ? "block" : "hidden"}>
          <SingleVariantForm ref={singleVariantFormRef} disabled={isFormSubmitting} />
        </div>

        <div className={simpleProduct ? "hidden" : "block"}>
          <MultipleVariantForm ref={multipleVariantFormRef} disabled={isFormSubmitting} />
        </div>
      </div>
    </div>
  )
}
