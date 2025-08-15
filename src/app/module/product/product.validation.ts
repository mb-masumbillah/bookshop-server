import z from 'zod'

// ----- Enums -----
export const availabilityEnum = z.enum(['in_stock', 'out_of_stock', 'preorder'])
export const visibilityEnum = z.enum(['public', 'private'])
export const discountTypeEnum = z.enum(['percent', 'fixed'])

// ----- Sub-schemas -----
const metaSchema = z.object({
  slug: z.string().optional(), // server pre-hook দিয়ে generate হবে
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
})

const discountSchema = z.object({
  type: discountTypeEnum,
  value: z.number(),
  finalPrice: z.number().optional(),
})

const ratingSchema = z.object({
  average: z.number().optional(),
  count: z.number().optional(),
})

const dimensionsSchema = z.object({
  widthCm: z.number(),
  heightCm: z.number(),
  thicknessCm: z.number(),
})

const actorRefSchema = z.object({
  actorId: z.string(),
  name: z.string().optional(),
})

export const productValidationSchema = z.object({
  body: z.object({
    title: z.string(),
    author: z.string(),
    category: z.string(),
    coverImage: z.string(),
    price: z.number(),
    currency: z.string(),
    availability: availabilityEnum,
    meta: metaSchema,

    // Optional fields (defaults in schema)
    subtitle: z.string().optional(),
    publisher: z.string().optional(),
    publicationDate: z.string().optional(),
    isbn10: z.string().optional(),
    isbn13: z.string().optional(),
    edition: z.string().optional(),
    language: z.string().optional(),
    format: z.string().optional(),
    pages: z.number().optional(),
    subCategory: z.string().optional(),
    tags: z.array(z.string()).optional(),
    summary: z.string().optional(),
    description: z.string().optional(),
    gallery: z.array(z.string()).optional(),
    stock: z.number().optional(),
    sku: z.string().optional(),
    dimensions: dimensionsSchema.optional(),
    weightGrams: z.number().optional(),
    featured: z.boolean().optional(),
    bestseller: z.boolean().optional(),
    visibility: visibilityEnum.optional(),
    rating: ratingSchema.optional(),
    discount: discountSchema.optional(),
    createdBy: actorRefSchema.optional(),
    updatedBy: actorRefSchema.optional(),
  }),
})

// ----- Update / PATCH Validation Schema -----
export const productUpdateValidationSchema = z.object({
  body: z
    .object({
      title: z.string().optional(),
      author: z.string().optional(),
      category: z.string().optional(),
      coverImage: z.string().optional(),
      price: z.number().optional(),
      currency: z.string().optional(),
      availability: availabilityEnum.optional(),
      meta: metaSchema,

      subtitle: z.string().optional(),
      publisher: z.string().optional(),
      publicationDate: z.string().optional(),
      isbn10: z.string().optional(),
      isbn13: z.string().optional(),
      edition: z.string().optional(),
      language: z.string().optional(),
      format: z.string().optional(),
      pages: z.number().optional(),
      subCategory: z.string().optional(),
      tags: z.array(z.string()).optional(),
      summary: z.string().optional(),
      description: z.string().optional(),
      gallery: z.array(z.string()).optional(),
      stock: z.number().optional(),
      sku: z.string().optional(),
      dimensions: dimensionsSchema,
      weightGrams: z.number().optional(),
      featured: z.boolean().optional(),
      bestseller: z.boolean().optional(),
      visibility: visibilityEnum.optional(),
      rating: ratingSchema.optional(),
      discount: discountSchema.optional(),
      createdBy: actorRefSchema.optional(),
      updatedBy: actorRefSchema.optional(),
    })
    .strict(),
})
