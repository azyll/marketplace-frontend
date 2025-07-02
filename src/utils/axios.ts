import Axios from "axios";
import { CONFIG } from "../constants/config";

const axios = Axios.create({
  baseURL: CONFIG.BASE_URL,
});

export default axios;
