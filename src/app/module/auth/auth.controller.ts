import { authService } from './auth.service'
import { catchAsync } from '../../../utils/catchAsync'
import { StatusCodes } from 'http-status-codes'
import sendResponse from '../../../utils/sendResponse'
import config from '../../config'

const loginUser = catchAsync(async (req, res) => {
  const { accessToken, refreshToken, needsPasswordChange } =
    await authService.loginUserIntoService(req.body)

  res.cookie('refreshToken', refreshToken, {
    secure: config.node_env === 'production',
    httpOnly: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 365,
  })

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Register success',
    data: {
      accessToken,
      needsPasswordChange,
    },
  })
})

const changePassword = catchAsync(async (req, res) => {
  const { ...passwordData } = req.body

  const result = await authService.changePassword(req.user, passwordData)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'password is updated succesfull',
    data: result,
  })
})

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies

  const result = await authService.refreshToken(refreshToken)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Access token is retrieved succesfully!',
    data: result,
  })
})

const forgetPassword = catchAsync(async (req, res) => {
  const email = req.body.email

  const result = await authService.forgetPassword(email)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Reset link is generated succesfully!',
    data: result,
  })
})

export const authController = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword
}
