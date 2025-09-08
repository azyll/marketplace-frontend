import { IProgram } from "./program.type";
import { IRoleSystemTag } from "./role.type";

export interface IUser {
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  roleId: string;
  roleSystemTag: IRoleSystemTag;
  id: string;
  student: IStudent;
  createdAt: Date;
  deletedAt: Date | null;
  updatedAt: Date | null;
}

export interface IStudent {
  id: number;
  userId: string;
  programId: string;
  program: IProgram;
  level: string;
  sex: "male | female";
  createdAt: Date;
  deletedAt: Date | null;
  updatedAt: Date | null;
}
