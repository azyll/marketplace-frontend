export interface IPaginatedResponseMeta {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

export interface IPaginatedResponse<T> {
  message: string;
  data: T;
  meta: IPaginatedResponseMeta;
}

export interface IPagination {
  page?: number;
  limit?: number;
}
