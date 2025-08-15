import { StatusCodes } from 'http-status-codes'
import { catchAsync } from '../../../utils/catchAsync'
import sendResponse from '../../../utils/sendResponse'
import { productService } from './product.service'

const createProduct = catchAsync(async (req, res) => {
  const { product } = req.body

  const result = await productService.createProductIntoDB(product)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'productData create success',
    data: result,
  })
})

export const productController = {
  createProduct,
}
