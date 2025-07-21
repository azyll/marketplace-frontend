import { ENDPOINT } from "../constants/endpoints";
import { IPaginatedResponse } from "../types/common.type";
import { IProduct, IProductListFilters } from "../types/product.type";
import axios from "../utils/axios";

// getProductList
export const getProductList = async (filters: IProductListFilters) => {
  const response = await axios.get<IPaginatedResponse<IProduct[]>>(
    ENDPOINT.PRODUCT.BASE,
    { params: filters }
  );
  return response.data;
};

// getProduct
// createProduct
// updateProduct
// deleteProduct
