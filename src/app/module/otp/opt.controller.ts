import { catchAsync } from '../../../utils/catchAsync'
import { otpService } from './otp.service'

const otp = catchAsync(async (req, res) => {
  const result = await otpService.otpStoreIntoDB(req.body)
    

})

export const optController = {
  otp,
}
