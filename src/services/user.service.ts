import axios from "../utils/axios";

export const getUsers = async () => {
  try {
    const response = await axios.get("/api/user");
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
