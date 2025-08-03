interface AuthContextType {
  user: string | null;
  userData: any;
  setUser: (id: string | null, role: string | null) => void;
  setUserData: (data: any) => void;
}
