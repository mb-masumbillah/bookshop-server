import { StatusCodes } from 'http-status-codes'
import { catchAsync } from '../../../utils/catchAsync'
import sendResponse from '../../../utils/sendResponse'
import { userService } from './user.service'
import config from '../../config'

const createUser = catchAsync(async (req, res) => {
  const { email, otp } = req.body

  const { accessToken, refreshToken, needsPasswordChange, user } =
    await userService.createUserIntoDB(email, otp)

  res.cookie('refreshToken', refreshToken, {
    secure: config.node_env === 'production',
    httpOnly: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'user create success',
    data: {
      accessToken,
      needsPasswordChange,
      user,
    },
  })
})

export const userController = { createUser }
