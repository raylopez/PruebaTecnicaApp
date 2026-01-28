export interface Invoice {
  id: number;
  total: number;
  due_date: Date;
  created_at: Date;
}

export enum ItemType {
  Product=1,
  Service=2
}

export interface CreateInvoice {
  client_id: string;
  due_date: Date,
  item_type: string;
  notes: string;
}

export interface CreateItem {
  description: string;
  quantity: number;
  unit_price: number;
  type: string
}

export const createItemInital: CreateItem = {
  description: '',
  quantity: 1,
  type: ItemType.Product.toString(),
  unit_price: 0
}

export interface CreateInvoiceItem {
  items: CreateItem[],
  tax: number;
  discount: number;
  subtotal: number;
  total: number;
  client_id: number,
  due_date: Date,
  notes: string
}


