export interface Category {
  id: number;
  name: string;
}

export interface Seller {
  id: number;
  username: string;
  email: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Offer {
  id: number;
  item_id: number;
  user_id: number;
  user: User;
  price: number;
  status: OfferStatus;
  created_at: string;
  updated_at: string;
}

export enum OfferStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  CANCELLED = "cancelled",
  REJECTED = "rejected",
}

export enum ItemStatus {
  AVAILABLE = "available",
  SOLD = "sold",
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
  status: ItemStatus;
  condition: ItemCondition;
  brand: string;
  created_at: string;
  updated_at: string;
  photo?: string;
}

export enum PurchaseType {
  DIRECT_PURCHASE = "direct_purchase",
  OFFER_ACCEPTED = "offer_accepted",
}
export interface Purchase {
  id: number;
  item_id: number;
  buyer_id: number;
  seller_id: number;
  price: number;
  type: string;
  purchased_at: string;
}

export interface ItemDetail extends Item {
  category: Category;
  seller: Seller;
  offers: Offer[];
  purchase: Purchase | null;
}

export enum FetchItemMode {
  BUY = "buy",
  SELL = "sell",
}

export interface OfferSubmission {
  item_id: number;
  price: number;
}
