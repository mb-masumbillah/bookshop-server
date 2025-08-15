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


const updateProductIntoDB = async (productId: string, payload: Partial<TProduct>) => {

    console.log(payload)
 
  // Transaction session (optional, for atomic update)
  const session = await mongoose.startSession();
  try {
    session.startTransaction();


    const existingProduct = await Product.findById(productId).session(session);
    if (!existingProduct) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Product not found');
    }


    if (existingProduct.isDeleted) {
      throw new AppError(StatusCodes.FORBIDDEN, 'Cannot update a deleted product');
    }

    if (existingProduct.availability === 'out_of_stock') {
      throw new AppError(StatusCodes.FORBIDDEN, 'Product is out of stock');
    }


    // Update
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      payload,
      { new: true, runValidators: true, session }
    );

    await session.commitTransaction();
    await session.endSession();

    return updatedProduct;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};



export const productService = {
  createProductIntoDB,
  updateProductIntoDB
}
