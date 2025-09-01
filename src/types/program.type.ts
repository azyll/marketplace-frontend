import { IDepartment } from "./department.type";

export interface IProgram {
  id: string;
  name: string;
  departmentId: string;
  department: IDepartment;
  createdAt: Date;
  deletedAt: Date | null;
  updatedAt: Date | null;
}
