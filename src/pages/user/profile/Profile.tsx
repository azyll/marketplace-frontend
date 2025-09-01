//Form
// Student ID
// First Name
// Last Name
// Program

import { EditableWrapper } from "@/components/EditableWrapper";
import { AuthContext } from "@/contexts/AuthContext";
import { Button, Select, Space, TextInput, Title } from "@mantine/core";
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

  const [isEdit, setIsEdit] = useState(false);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      firstname: user.user?.firstName,
      lastname: user.user?.lastName,
      program: user.user?.student.program?.name,
      studentid: user.user?.student.id,
    },
  });

  useEffect(() => {
    form.setInitialValues({
      firstname: user.user?.firstName,
      lastname: user.user?.lastName,
      program: user.user?.student?.program?.name,
      studentid: user.user?.student.id,
    });
    form.reset();
  }, [user]);

  return (
    <div className="mx-auto max-w-page-width page-x-padding mt-4">
      <Button onClick={() => setIsEdit((prev) => !prev)}>Edit</Button>

      <div>
        <Title size="h3">User Details</Title>

        <EditableWrapper
          label="First Name"
          value={form.values.firstname}
          state={isEdit ? "edit" : "view"}
        >
          <TextInput
            label="First Name"
            {...form.getInputProps("firstname")}
          />
        </EditableWrapper>

        <EditableWrapper
          label="Last Name"
          value={form.values.lastname}
          state={isEdit ? "edit" : "view"}
        >
          <TextInput
            label="Last Name"
            {...form.getInputProps("lastname")}
          />
        </EditableWrapper>
      </div>

      <Space h={16} />

      <div>
        <Title size="h3">Student Details</Title>

        <EditableWrapper
          label="Student ID"
          value={form.values.studentid}
          state={isEdit ? "edit" : "view"}
        >
          <TextInput
            label="Student ID"
            {...form.getInputProps("studentid")}
          />
        </EditableWrapper>

        <EditableWrapper
          label="Program"
          value={form.values.program}
          state={isEdit ? "edit" : "view"}
        >
          <Select
            label="Program"
            {...form.getInputProps("program")}
            data={[
              "Bachelor of Arts in Communication",
              "Bachelor of Science in Business Administration",
              "Bachelor of Science in Computer Engineering",
              "Bachelor of Science in Computer Science",
              "Bachelor of Science in Hospitality Management",
              "Bachelor of Science in Information Technology",
              "Bachelor of Science in Tourism Management",
            ]}
          />
        </EditableWrapper>
      </div>
    </div>
  );
}
