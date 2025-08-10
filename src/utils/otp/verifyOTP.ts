import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../app/Error/AppError'
import { OTP } from '../../app/module/otp/otp.model'


export const verifyOtp = async (email:string, otp:string) => {
  
 // OTP খুঁজে নিন session এর সাথে
    const existingOTP = await OTP.findOne({ email })
    if (!existingOTP) {
      throw new AppError(StatusCodes.NOT_FOUND, 'OTP not found for this email')
    }

    // OTP expired কিনা চেক করা
    const now = new Date()
    if (existingOTP.expireAt && existingOTP.expireAt < now) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'OTP expired')
    }

    // OTP মিলছে কিনা চেক করা
    if (existingOTP?.otp !== otp) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'OTP does not match')
    }

    return existingOTP
}
