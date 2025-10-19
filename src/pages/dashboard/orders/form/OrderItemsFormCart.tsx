import { Card, ScrollArea } from "@mantine/core"

export const OrderItemsFormCart = () => {
  return (
    <div className="sticky top-18">
      <Card radius="md" p={0}>
        <ScrollArea h={"85vh"}>
          <div className="p-5">CART</div>
        </ScrollArea>
      </Card>
    </div>
  )
}
