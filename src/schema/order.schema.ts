import z from "zod"

export const createOrderSchema = z.object({
  student: z.object({
    studentNumber: z.string().min(1, "Student number is required"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    program: z.string().min(1, { message: "Program ID is required." }),
    sex: z.enum(["male", "female"]),
  }),
  orderItems: z
    .array(
      z.object({
        productVariantId: z.string().uuid("Product Variant ID must be a valid UUID"),
        quantity: z.number().int().min(1, "Quantity must be at least 1"),
      }),
    )
    .min(1, "At least one order item is required"),
})
