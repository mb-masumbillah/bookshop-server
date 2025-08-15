import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../Error/AppError'
import { TProduct } from './product.interface'
import { Product } from './product.model'
import mongoose from 'mongoose'

const createProductIntoDB = async (payload: TProduct) => {
  const productExist = await Product.isProductExist(payload?.meta?.slug)

  if (productExist) {
    throw new AppError(StatusCodes.CONFLICT, 'product is exist')
  }

  const result = await Product.create(payload)

  return result
}

const updateProductIntoDB = async (
  productId: string,
  payload: Partial<TProduct>,
) => {
  if (!productId) {
    throw new AppError(StatusCodes.FORBIDDEN, 'Product id unauthorized')
  }

  // Transaction session (optional, for atomic update)
  const session = await mongoose.startSession()
  try {
    session.startTransaction()

    const existingProduct = await Product.findById(productId).session(session)
    if (!existingProduct) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Product not found')
    }

    if (existingProduct.isDeleted) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        'Cannot update a deleted product',
      )
    }

    // Update
    const updatedProduct = await Product.findByIdAndUpdate(
      { _id: productId },
      payload,
      { new: true, runValidators: true, session },
    )

    await session.commitTransaction()
    await session.endSession()

    return updatedProduct
  } catch (error) {
    await session.abortTransaction()
    await session.endSession()
    throw error
  }
}

const deleteProductIntoDB = async (productId: string) => {
  if (!productId) {
    throw new AppError(StatusCodes.FORBIDDEN, 'Product id unauthorized')
  }

  const product = await Product.findById({ _id: productId })
  if (!product) {
    throw new AppError(StatusCodes.CONFLICT, 'Product is not exists')
  }

  if (product?.isDeleted) {
    throw new AppError(StatusCodes.FORBIDDEN, 'Product is deleted')
  }

  const deleteData: Partial<TProduct> = {}
  deleteData.isDeleted = true

  const result = await Product.findOneAndUpdate(
    { _id: productId },
    deleteData,
    {
      new: true,
      runValidators: true,
    },
  )
  return result
}

export const productService = {
  createProductIntoDB,
  updateProductIntoDB,
  deleteProductIntoDB,
}
