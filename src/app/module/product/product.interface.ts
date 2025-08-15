import { Model, Types } from 'mongoose'
import { TAvailability, TDiscountType, TVisibility } from './product.constant'

export type TDimensions = {
  widthCm: number
  heightCm: number
  thicknessCm: number
}

export type TRating = {
  average: number // 0..5
  count: number // >=0
}

export type TDiscount = {
  type: TDiscountType
  value: number // percent: 0..100, fixed: 0..price
  finalPrice?: number // server will compute and store
}

export type TMeta = {
  seoTitle?: string
  seoDescription?: string
  slug: string // unique-ish url id (required in schema)
}

export type TActorRef = {
  id?: Types.ObjectId
  name?: string
}

export type TProduct = {
  // Required fields (no default in schema)
  title: string
  author: string
  category: string
  coverImage: string
  price: number
  currency: string // default: "BDT"
  stock: number
  availability: TAvailability
  meta: TMeta

  // Optional or has default values in schema
  subtitle?: string
  publisher?: string
  publicationDate?: string
  isbn10?: string
  isbn13?: string
  edition?: string
  language?: string
  format?: string
  pages?: number

  subCategory?: string
  tags?: string[]

  summary?: string
  description?: string

  gallery?: string[]

  discount?: TDiscount

  sku?: string
  dimensions?: TDimensions
  weightGrams?: number

  featured?: boolean
  bestseller?: boolean
  visibility?: TVisibility

  rating?: TRating

  createdBy?: TActorRef
  updatedBy?: TActorRef

  createdAt?: string | Date
  updatedAt?: string | Date

  isDeleted: boolean

  __v?: number
}

export interface ProductModel extends Model<TProduct> {
  isProductExist(slug: string): Promise<TProduct>
}
