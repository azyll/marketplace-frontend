export const STOCK_CONDITION = {
  IN_STOCK: "in-stock",
  OUT_OF_STOCK: "out-of-stock",
  LOW_STOCK: "low-stock",
}

export const stockConditionLabel = {
  [STOCK_CONDITION.IN_STOCK]: "In Stock",
  [STOCK_CONDITION.OUT_OF_STOCK]: "Out of Stock",
  [STOCK_CONDITION.LOW_STOCK]: "Low Stock",
}

export const stockConditionColor = {
  [STOCK_CONDITION.IN_STOCK]: "green",
  [STOCK_CONDITION.OUT_OF_STOCK]: "red",
  [STOCK_CONDITION.LOW_STOCK]: "yellow",
}
