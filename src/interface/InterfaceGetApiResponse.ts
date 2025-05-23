import { Customer } from "./InterfaceCustomer";

export interface GetApiResponse {
  statusCode: number;
  message: string;
  data: {
    customers: Customer[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
  };
}
