import { Client } from "../models/client";

export interface Company {
  id: number;
  name: string;
  email: string;
  address: string;
  state: string;
  country: string;
  zip_code: string;
  phone: string;
  clients: Client[]
}
