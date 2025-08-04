export interface AuthContextType {
  user: string | null;
  userData: any;
  setUser: (id: string | null, role: string | null) => void;
  setUserData: (data: any) => void;
}

export interface ILoginResponse {
  accessToken: string;
}

export type IRoleSystemTag = "student" | "admin" | "employee";

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  roleSystemTag: IRoleSystemTag;
  id: string;
}
