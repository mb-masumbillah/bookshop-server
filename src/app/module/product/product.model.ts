import { model, Schema } from 'mongoose'
import {
  ProductModel,
  TActorRef,
  TDimensions,
  TDiscount,
  TMeta,
  TProduct,
  TRating,
} from './product.interface'
import slugify from 'slugify'

// ----- Helper: Compute Final Price -----
const computeFinalPrice = (
  price: number,
  discount: { type: 'percent' | 'fixed'; value: number },
) => {
  if (discount.type === 'percent') {
    const pct = Math.min(Math.max(discount.value, 0), 100) // clamp 0–100
    const discountedPrice = (price * (100 - pct)) / 100
    return Math.max(0, Math.round(discountedPrice))
  }
  return Math.max(0, price - Math.max(discount.value, 0))
}

// ----- Sub-schemas -----
const DimensionsSchema = new Schema<TDimensions>({
  widthCm: { type: Number, required: true },
  heightCm: { type: Number, required: true },
  thicknessCm: { type: Number, required: true },
})

const RatingSchema = new Schema<TRating>({
  average: { type: Number, min: 0, max: 5, default: 0 },
  count: { type: Number, min: 0, default: 0 },
})

const DiscountSchema = new Schema<TDiscount>({
  type: { type: String, enum: ['percent', 'fixed'], required: true },
  value: { type: Number, required: true },
  finalPrice: { type: Number },
})

const MetaSchema = new Schema<TMeta>({
  seoTitle: { type: String, default: '' },
  seoDescription: { type: String, default: '' },
  slug: { type: String, required: true, unique: true },
})

const ActorRefSchema = new Schema<TActorRef>({
  id: { type: Schema.Types.ObjectId, ref: 'User' },
  name: { type: String },
})

// ----- Main Product Schema -----
const ProductSchema = new Schema<TProduct, ProductModel>(
  {
    // ----- Required Fields -----
    title: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, required: true },
    coverImage: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, required: true, default: 'BDT' },
    availability: {
      type: String,
      enum: ['in_stock', 'out_of_stock', 'preorder'],
      required: true,
      default: 'in_stock',
    },
    meta: { type: MetaSchema, required: true },

    // ----- Defaults -----
    subtitle: { type: String, default: '' },
    publisher: { type: String, default: '' },
    publicationDate: { type: String, default: '' },
    isbn10: { type: String, default: '' },
    isbn13: { type: String, default: '' },
    edition: { type: String, default: '' },
    language: { type: String, default: '' },
    format: { type: String, default: '' },
    pages: { type: Number, default: 0 },
    subCategory: { type: String, default: '' },
    tags: { type: [String], default: [] },
    summary: { type: String, default: '' },
    description: { type: String, default: '' },
    gallery: { type: [String], default: [] },
    stock: { type: Number, default: 0 },
    sku: { type: String, default: '' },
    dimensions: { type: DimensionsSchema, default: null },
    weightGrams: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    bestseller: { type: Boolean, default: false },
    visibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'public',
    },
    rating: { type: RatingSchema, default: () => ({ average: 0, count: 0 }) },
    discount: { type: DiscountSchema, default: null },
    createdBy: { type: ActorRefSchema, default: null },
    updatedBy: { type: ActorRefSchema, default: null },
  },
  { timestamps: true },
)

// ----- Pre-save Hook -----
ProductSchema.pre('save', function (next) {
  if (this.discount) {
    this.discount.finalPrice = computeFinalPrice(this.price, {
      type: this.discount.type,
      value: this.discount.value,
    })
  } else {
    this.discount = {
      type: 'fixed',
      value: 0,
      finalPrice: this.price,
    } as TDiscount
  }
  next()
})

ProductSchema.pre('validate', function (next) {
  if (
    !this.meta.slug ||
    this.isModified('title') ||
    this.isModified('author') ||
    this.isModified('edition')
  ) {
    this.meta.slug = slugify(
      `${this.title}-${this.author}-${this.edition || ''}`,
      { lower: true },
    )
  }
  next()
})

ProductSchema.statics.isProductExist = async function (slug: string) {
  return await this.findOne({ 'meta?.slug': slug })
}

export const Product = model<TProduct, ProductModel>('Book', ProductSchema)
