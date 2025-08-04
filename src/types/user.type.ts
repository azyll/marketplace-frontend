import { IRoleSystemTag } from "./role.type";

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  roleSystemTag: IRoleSystemTag;
  id: string;
}
