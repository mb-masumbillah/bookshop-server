import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../Error/AppError'
import { TProduct } from './product.interface'
import { Product } from './product.model'

const createProductIntoDB = async (payload: TProduct) => {
  const productExist = await Product.isProductExist(payload?.meta?.slug)

  if (productExist) {
    throw new AppError(StatusCodes.CONFLICT, 'product is exist')
  }

  const result = await Product.create(payload)

  return result
}

export const productService = {
  createProductIntoDB,
}
