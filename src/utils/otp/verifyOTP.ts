import { AppError } from '../../app/Error/AppError'
import { TOtp } from '../../app/module/otp/otp.interface'


export const verifyOtp = async (otpDoc:TOtp, otp: string) => {
  

  if (!otpDoc) {
    throw new AppError(404, 'OTP not found')
  }
  if (otpDoc.expireAt < new Date()) {
    throw new AppError(400, 'OTP expired')
  }
  if (otpDoc.otp !== otp) {
    throw new AppError(400, 'OTP mismatch')
  }

  return true
}
