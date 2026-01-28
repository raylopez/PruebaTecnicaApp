import { Invoice } from "./invoice";

export interface Client {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  state: string;
  country: string;
  zip_code: string;
  phone: string;
  invoices: Invoice[];
}
