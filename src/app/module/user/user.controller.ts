import { StatusCodes } from 'http-status-codes'
import { catchAsync } from '../../../utils/catchAsync'
import sendResponse from '../../../utils/sendResponse'
import { userService } from './user.service'

const createUser = catchAsync(async (req, res) => {
  const { password, user: userData, otp } = req.body

  const result = await userService.createUserIntoDB(password, userData, otp)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'user create success',
    data: result,
  })
})

export const userController = { createUser }
