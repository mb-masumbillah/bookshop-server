import { StatusCodes } from 'http-status-codes'
import { catchAsync } from '../../../utils/catchAsync'
import sendResponse from '../../../utils/sendResponse'
import { otpService } from './otp.service'

const sendOTP = catchAsync(async (req, res) => {
  const { password, user } = req.body

  const result = await otpService.otpStoreIntoDB( password, user)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'otp send to email',
    data: result,
  })
})

const updateOtp = catchAsync(async (req, res) => {
  const { email } = req.body

  const result = await otpService.resendOtpUpdateIntoDB(email)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'OTP resent successfully',
    data: result,
  })
})

export const optController = {
  sendOTP,
  updateOtp,
}
