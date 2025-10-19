import { z } from "zod"

export const createProductVariantSchema = z.object({
  name: z.string().min(1, { message: "Size is required. Enter 'N/A' if not applicable." }),
  productAttributeId: z.string().min(1, { message: "Attribute is required" }),
  size: z.string().min(1, { message: "Size is required. Enter 'N/A' if not applicable." }),
  price: z.number().min(1, { message: "Price is required." }),
  stockQuantity: z.number().min(1, { message: "Stock is required." }),
})

export const createProductSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  image: z
    .file()
    .max(5 * 1024 ** 2, { message: "Image size is too large (max 5mb)" })
    .optional(),
  type: z.string().min(1, { message: "Type is required" }),
  departmentId: z.string().min(1, { message: "Department is required" }),
  variants: z.array(createProductVariantSchema),
  category: z.string().min(1, { message: "Category is required" }),
  level: z.enum(["shs", "tertiary", "all"]),
})

export const updateUserSchema = createProductSchema.partial()
