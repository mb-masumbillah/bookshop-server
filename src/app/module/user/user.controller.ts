import { StatusCodes } from 'http-status-codes'
import { catchAsync } from '../../../utils/catchAsync'
import sendResponse from '../../../utils/sendResponse'
import { userService } from './user.service'

const createUser = catchAsync(async (req, res) => {
  const { email, otp } = req.body

  const { accessToken, refreshToken, needsPasswordChange, user } =
    await userService.createUserIntoDB(email, otp)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'user create success',
    data: {
      accessToken,
      refreshToken,
      needsPasswordChange,
      user,
    },
  })
})

export const userController = { createUser }
