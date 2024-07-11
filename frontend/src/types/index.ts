export interface Category {
  id: number;
  name: string;
}

export enum ViewType {
  BUY = "BUY",
  SELL = "SELL",
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

export enum ItemCondition {
  NEW = "new",
  ALMOST_NEW = "amost_new",
  LIGHTLY_USED = "lightly_used",
  HEAVILY_USED = "heavily_used",
  REFURBISHED = "refurbished",
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

export interface OfferSubmission {
  item_id: number;
  price: number;
}

export enum Sorting {
  LATEST = "latest",
  LOWEST_PRICE = "price_low_to_high",
  HIGHEST_PRICE = "price_high_to_low",
}
