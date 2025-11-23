import { z } from "zod"

export const createAnnouncementSchema = z.object({
  image: z
    .file()
    .max(5 * 1024 ** 2, { message: "Image size is too large (max 5mb)" })
    .optional(),
  productId: z.string().optional(),
  title: z.string().min(1, { message: "Title is required" }),
  message: z.string().nullable().optional(),
})

export const updateAnnouncementSchema = createAnnouncementSchema.partial()
