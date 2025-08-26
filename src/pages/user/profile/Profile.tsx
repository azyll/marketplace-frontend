//Form
// Student ID
// First Name
// Last Name
// Program

import { EditableWrapper } from "@/components/EditableWrapper";
import { AuthContext } from "@/contexts/AuthContext";
import { Button, Group, Space, Stack, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useContext, useEffect, useState } from "react";

// User Details
// User fullName

// Student Details
// Student ID
// Program
// Level

export default function Profile() {
  const user = useContext(AuthContext);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      fullname: user.user?.fullName,
      program: "",
    },
  });

  useEffect(() => {
    form.setInitialValues({
      fullname: user.user?.fullName,
      program: "TEST",
    });
    form.reset();
  }, [user]);

  const [isEdit, setIsEdit] = useState(false);

  return (
    <div className="mx-auto max-w-page-width page-x-padding mt-4">
      <Button onClick={() => setIsEdit((prev) => !prev)}>Toggle</Button>

      <div>
        <Title size="h3">User Details</Title>

        <EditableWrapper
          label="Full Name"
          value={form.values.fullname}
          state={isEdit ? "edit" : "view"}
        >
          <TextInput
            label="Full name"
            {...form.getInputProps("fullname")}
          />
        </EditableWrapper>
      </div>

      <Space h={16} />

      <div>
        <Title size="h3">Student Details</Title>

        <EditableWrapper
          label="Program"
          value={form.values.program}
          state={isEdit ? "edit" : "view"}
        >
          <TextInput
            label="Program"
            {...form.getInputProps("program")}
          />
        </EditableWrapper>
      </div>
    </div>
  );
}
