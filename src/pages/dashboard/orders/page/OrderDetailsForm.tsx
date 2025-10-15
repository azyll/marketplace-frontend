import { createOrderSchema } from "@/schema/order.schema"
import { ICreateOrderInput } from "@/types/order.type"
import { Grid, Select, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form"
import { zod4Resolver } from "mantine-form-zod-resolver"

export const OrderDetailsForm = () => {
  const form = useForm<ICreateOrderInput>({
    initialValues: {
      student: {
        studentNumber: "",
        firstName: "",
        lastName: "",
        program: "",
        sex: "male",
      },
      orderItems: [
        {
          productVariantId: "",
          quantity: 1,
        },
      ],
    },
    validate: zod4Resolver(createOrderSchema) as any,
  })

  const sexOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ]

  return (
    <form>
      <Grid>
        <Grid.Col span={6}>
          {/* Student Number */}
          <TextInput
            label="Student Number"
            placeholder="Enter student number"
            {...form.getInputProps("student.studentNumber")}
          />
        </Grid.Col>

        <Grid.Col span={6}>
          {/* Sex */}
          <Select
            label="Sex"
            placeholder="Select sex"
            data={sexOptions}
            {...form.getInputProps("student.sex")}
          />
        </Grid.Col>

        <Grid.Col span={6}>
          {/* First Name */}
          <TextInput
            label="First Name"
            placeholder="Enter first name"
            {...form.getInputProps("student.firstName")}
          />
        </Grid.Col>

        <Grid.Col span={6}>
          {/* Last Name */}
          <TextInput
            label="Last Name"
            placeholder="Enter last name"
            {...form.getInputProps("student.lastName")}
          />
        </Grid.Col>

        <Grid.Col span={12}>
          {/* Program */}
          <Select
            label="Program"
            placeholder="Select program"
            data={[]} // Add your program options here
            {...form.getInputProps("student.program")}
          />
        </Grid.Col>

        {/* Order Items section - you'll need to implement this separately
            since it's an array and requires dynamic add/remove functionality */}
      </Grid>
    </form>
  )
}
