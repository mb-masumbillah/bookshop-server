import { Types } from "mongoose";
import { TAvailability, TDiscountType, TVisibility } from "./product.constant";


export type TDimensions = {
  widthCm: number;
  heightCm: number;
  thicknessCm: number;
};

export type TRating = {
  average: number; // 0..5
  count: number;   // >=0
};

export type TDiscount = {
  type: TDiscountType;
  value: number;     // percent: 0..100, fixed: 0..price
  finalPrice?: number; // server will compute and store
};

export type TMeta = {
  seoTitle?: string;
  seoDescription?: string;
  slug: string; // unique-ish url id
};

export type TActorRef = {
  actorId: Types.ObjectId;
  name: string;
};

export type TProduct = {
  title: string;
  subtitle?: string;
  author: string;
  publisher?: string;
  publicationDate?: string; // ISO date string
  isbn10?: string;
  isbn13?: string;
  edition?: string;
  language?: string;
  format?: string;
  pages?: number;

  category: string;
  subCategory?: string;
  tags?: string[];

  summary?: string;
  description?: string;

  coverImage: string;
  gallery?: string[];

  price: number;
  currency: string; // e.g. "BDT"

  discount?: TDiscount;

  stock: number;
  sku?: string;
  availability: TAvailability;

  dimensions?: TDimensions;
  weightGrams?: number;

  featured?: boolean;
  bestseller?: boolean;
  visibility?: TVisibility;

  rating?: TRating;

  meta: TMeta;

  createdBy?: TActorRef;
  updatedBy?: TActorRef;

  createdAt?: string | Date;
  updatedAt?: string | Date;
  __v?: number;
};
