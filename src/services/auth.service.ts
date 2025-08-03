import axios from "../utils/axios";

export const loginUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const response = await axios.post(" /auth/login", {
    email,
    password,
  });
  return response.data;
};
