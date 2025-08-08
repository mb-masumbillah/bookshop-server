import { StatusCodes } from 'http-status-codes'
import { catchAsync } from '../../../utils/catchAsync'
import sendResponse from '../../../utils/sendResponse'
import { otpService } from './otp.service'

const otp = catchAsync(async (req, res) => {

  const {password, user} = req.body
  const result = await otpService.otpStoreIntoDB(password, user)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'otp send to email',
    data: result
  })

})

export const optController = {
  otp,
}
