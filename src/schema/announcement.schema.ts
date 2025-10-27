import { z } from "zod"

export const createAnnouncementSchema = z.object({
  image: z
    .file()
    .max(5 * 1024 ** 2, { message: "Image size is too large (max 5mb)" })
    .optional(),
  productId: z.string().min(1, { message: "Product  is required" }).optional(),
  title: z.string().min(1, { message: "Title is required" }).optional(),
  content: z.string().min(1, { message: "Content is required" }).optional(),
})

export const updateAnnouncementSchema = createAnnouncementSchema.partial()
