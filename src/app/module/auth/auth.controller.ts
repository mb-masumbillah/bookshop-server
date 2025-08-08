import { authService } from './auth.service'
import { catchAsync } from '../../../utils/catchAsync'
import { StatusCodes } from 'http-status-codes'
import sendResponse from '../../../utils/sendResponse'

const registerUser = catchAsync(async(req, res) => {
  const result = await authService.registerUserIntoService(req.body)
    

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Register success',
    data: result,
  })
})

export const authController = {
  registerUser,
}
