import { ActionIcon, Button, CloseButton, Drawer, Group, Input } from "@mantine/core"
import { IconSearch } from "@tabler/icons-react"
import { useFilters } from "@/hooks/useFilters"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router"

interface HeaderSearch {
  search?: string
}

export default function HeaderSearchBar() {
  const navigate = useNavigate()

  const [searchOpen, setSearchOpen] = useState(false)

  const [filter, setFilterValue] = useFilters<HeaderSearch>({
    search: undefined,
  })

  const handleSearch = () => {
    if (filter.search && filter.search.trim()) {
      navigate(`/products?search=${encodeURIComponent(filter.search.trim())}`)
      setSearchOpen(false)
    }
  }

  // Auto-search for desktop
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (filter.search && filter.search.trim()) {
        navigate(`/products?search=${encodeURIComponent(filter.search.trim())}`)
      } else if (filter.search === "") {
        navigate("/products")
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [filter.search, navigate])

  return (
    <>
      {/* Search for mobile only */}
      <ActionIcon
        variant="subtle"
        hiddenFrom="sm"
        onClick={() => {
          setSearchOpen(true)
        }}
      >
        <IconSearch />
      </ActionIcon>

      <Drawer
        opened={searchOpen}
        onClose={() => setSearchOpen(false)}
        position="top"
        size="100%"
        padding="md"
        withCloseButton={false}
      >
        <Group justify="space-between" mb="md" wrap="nowrap" gap="xs">
          <Input
            placeholder="Search products"
            value={filter.search || ""}
            onChange={(value) => setFilterValue("search", value.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            radius="xl"
            flex={1}
            rightSection={
              <div className="pointer-events-auto flex h-full items-center justify-center">
                <ActionIcon variant="light" radius="xl" onClick={handleSearch}>
                  <IconSearch size={20} strokeWidth={2.5} />
                </ActionIcon>
              </div>
            }
          />

          <Button variant="subtle" color="gray" size="sm" onClick={() => setSearchOpen(false)}>
            Cancel
          </Button>
        </Group>
      </Drawer>

      {/* Search Bar for desktop */}
      <Input
        variant="filled"
        w={{ base: 160, xs: 100, sm: 200 }}
        flex={1}
        visibleFrom="sm"
        rightSection={
          <div className="pointer-events-auto flex h-full items-center justify-center">
            {filter.search ? (
              <CloseButton
                radius="xl"
                onClick={() => {
                  setFilterValue("search", "")
                  handleSearch()
                }}
              />
            ) : (
              <ActionIcon variant="subtle" onClick={() => handleSearch()} radius="xl">
                <IconSearch size={20} strokeWidth={2.5} />
              </ActionIcon>
            )}
          </div>
        }
        radius="xl"
        placeholder="Search products"
        value={filter.search || ""}
        onChange={(e) => setFilterValue("search", e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
    </>
  )
}
