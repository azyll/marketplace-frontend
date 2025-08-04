import { IUser } from "../types/user.type";
import axios from "../utils/axios";

export const getLoggedInUser = async () => {
  return axios.get<IUser>("/me");
};

export const getUsers = async () => {
  try {
    const response = await axios.get("/api/user");
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const postUsers = async () => {
  try {
    const response = await axios.post("/api/user");
  } catch (error) {
    console.log(error);
  }
};
