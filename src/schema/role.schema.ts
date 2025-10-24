import { Module } from "@/types/role.type"
import { z } from "zod"

export const createRoleSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    systemTag: z.enum(["student", "employee", "admin"]),
    modulePermission: z
      .array(
        z
          .object({
            module: z.enum(Module),
            permission: z.enum(["view", "edit"]),
          })
          .optional(),
      )
      .optional(),
  })
  .refine(
    (data) => {
      // If systemTag is "employee", modulePermission must not be empty or undefined
      if (
        data.systemTag === "employee" &&
        (!data.modulePermission || data.modulePermission.length === 0)
      ) {
        return false
      }
      return true
    },
    {
      message: "Module permission is required for employee roles",
      path: ["modulePermission"], // Path to the field you want to attach the error to
    },
  )

export const updateRoleSchema = createRoleSchema
