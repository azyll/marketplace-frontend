import { IUser } from "./user.type";

export interface IAuthContext {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  logout: () => void;
  fetchUser: () => void;
}

export interface ILoginResponse {
  accessToken: string;
}
