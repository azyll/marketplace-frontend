import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "react-router"
import { KEY } from "@/constants/key"
import { getProductList } from "@/services/products.service"
import { Card, Grid, Pagination, Space, Text } from "@mantine/core"
import { useEffect, useMemo, useContext } from "react"
import { useFilters } from "@/hooks/useFilters"
import FilterBar from "@/components/FilterBar"
import { PRODUCT_CATEGORY } from "@/constants/product"
import { IProductListFilters } from "@/types/product.type"
import ProductCardSkeleton from "@/components/ProductCardSkeleton"
import { IconMoodSad } from "@tabler/icons-react"
import ProductCard from "@/components/ProductCard"
import { AuthContext } from "@/contexts/AuthContext"

export default function Products() {
  const user = useContext(AuthContext)
  const [searchParams, setSearchParams] = useSearchParams()

  const department = user.user?.student?.program?.department?.name
  const sex = user.user?.student?.sex

  const [filter, setFilterValue] = useFilters<IProductListFilters>({
    category: searchParams.get("category") ?? PRODUCT_CATEGORY.ALL,
    latest: true,
    limit: 8,
    search: searchParams.get("search") ?? undefined,
  })

  const handleOnCategorySelect = (category: string | null) => {
    // Keep existing search when changing category
    const newParams = new URLSearchParams(searchParams)

    if (category) {
      newParams.set("category", category)
    } else {
      // Remove category param when deselected
      newParams.delete("category")
    }

    setSearchParams(newParams)
    setFilterValue("category", category ?? undefined)
  }

  const { data: products, isLoading } = useQuery({
    queryKey: [KEY.PRODUCTS, filter, department, sex, searchParams.get("department")],
    queryFn: () => {
      const queryParams: any = {
        ...filter,
        category: filter.category === PRODUCT_CATEGORY.ALL ? undefined : filter.category,
      }

      // Priority: URL department param > user's department context
      const departmentFromUrl = searchParams.get("department")
      const activeDepartment = departmentFromUrl || department

      if (activeDepartment) {
        queryParams.department = activeDepartment
      }

      // Add sex-based filtering if user is logged in and has a sex value
      if (sex) {
        queryParams.sex = sex
      }

      return getProductList(queryParams)
    },
  })

  const totalPages = useMemo(() => {
    const totalItems = products?.meta.totalItems ?? 0
    const itemsPerPage = products?.meta.itemsPerPage ?? 8

    return Math.ceil(totalItems / itemsPerPage)
  }, [products])

  const showCarousel = useMemo(() => {
    return isLoading || (products?.data && products.data.length > 0)
  }, [isLoading, products])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Update filters when URL changes
  useEffect(() => {
    const searchParam = searchParams.get("search")

    if (searchParam !== filter.search) {
      setFilterValue("search", searchParam || undefined)
    }
  }, [searchParams])

  // Get the department name for display (from filter or user context)
  const currentDepartment = useMemo(() => {
    return filter.department || department
  }, [filter.department, department])

  return (
    <main className="mx-auto max-w-[1200px]">
      <Space h="sm" />
      <section className="px-4 xl:px-0">
        <FilterBar
          onProgramSelect={(department) => setFilterValue("department", department)}
          onCategorySelect={(category) => handleOnCategorySelect(category)}
        />
      </section>

      <Pagination
        my="xs"
        size="sm"
        styles={{
          control: {
            border: 0,
          },
        }}
        value={filter.page}
        onChange={(page) => setFilterValue("page", page)}
        total={totalPages}
      />

      {/* Show current search term */}
      {filter.search && (
        <section className="px-4 xl:px-0">
          <Text size="sm" c="dimmed">
            Search results for: "{filter.search}"
          </Text>
          <Space h="xs" />
        </section>
      )}

      <section>
        {showCarousel ? (
          <Grid px={{ base: 16, xl: 0 }} mt="">
            {isLoading
              ? [...Array(8)].map((_, index) => (
                  <Grid.Col key={index} span={{ base: 12, sm: 6, md: 3 }}>
                    <ProductCardSkeleton />
                  </Grid.Col>
                ))
              : products?.data?.map((product, index) => (
                  <Grid.Col key={index} span={{ base: 12, sm: 6, md: 3 }}>
                    <ProductCard product={product} />
                  </Grid.Col>
                ))}
          </Grid>
        ) : (
          <Card h={340} bg="#e9edf3" padding="sm" radius="lg" mx={{ base: 16, xl: 0 }}>
            <div className="flex h-full flex-col items-center justify-center">
              <IconMoodSad color="gray" size={32} stroke={1.5} />
              <Text ta="center" c="dimmed">
                {filter.search ? `No products found for "${filter.search}"` : "No products found."}
              </Text>
            </div>
          </Card>
        )}
      </section>
    </main>
  )
}
