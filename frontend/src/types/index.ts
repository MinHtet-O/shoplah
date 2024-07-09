export interface Category {
  id: number;
  name: string;
}

export interface Seller {
  id: number;
  username: string;
  email: string;
}

export interface Offer {
  id: number;
  item_id: number;
  user_id: number;
  price: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export enum ItemCondition {
  NEW = "new",
  USED = "used",
  REFURBISHED = "refurbished",
}

export interface Item {
  id: number;
  seller_id: number;
  category_id: number;
  title: string;
  description: string;
  price: number;
  status: string;
  condition: ItemCondition;
  brand: string;
  created_at: string;
  updated_at: string;
  photo?: string;
}

export interface ItemDetail extends Item {
  category: Category;
  seller: Seller;
  offers: Offer[];
}

export enum FetchItemMode {
  BUY = "buy",
  SELL = "sell",
}

export interface OfferSubmission {
  item_id: number;
  price: number;
}
