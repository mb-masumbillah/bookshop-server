import { StatusCodes } from 'http-status-codes'
import { catchAsync } from '../../../utils/catchAsync'
import sendResponse from '../../../utils/sendResponse'
import { productService } from './product.service'

const createProduct = catchAsync(async (req, res) => {
  const { book } = req.body

  const result = await productService.createProductIntoDB(book)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'productData create success',
    data: result,
  }) 
})

const updateProduct = catchAsync(async (req, res) => {
  const { productId } = req.params; // যেটা আপডেট করতে চাচ্ছেন
  const book  = req.body;


  const updatedProduct = await productService.updateProductIntoDB(productId, book);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Product update success',
    data: updatedProduct,
  });
});

export const productController = {
  createProduct,
  updateProduct
}
