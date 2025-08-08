import { StatusCodes } from 'http-status-codes'
import { generateOTP } from '../../../utils/otp/generateOTP'
import { TOtp } from './otp.interface'
import { OTP } from './otp.model'
import { User } from '../user/user.model'
import { AppError } from '../../Error/AppError'
import sendEmail from '../../../utils/otp/sendEmail'

const otpStoreIntoDB = async (password: string, payload: TOtp) => {
  const data: Partial<TOtp> = { ...payload }

  const otpCode = generateOTP()

  data.otp = otpCode
  data.password = password

  const user = await User.isUserExistsByCustomEmail(payload.email)

  if (user) {
    throw new AppError(StatusCodes.CONFLICT, 'User is exist')
  }
  const otp = await OTP.findOne({ email: payload?.email })

  if (otp) {
    throw new AppError(StatusCodes.CONFLICT, 'Please , check you mail')
  }

  const otpData = await OTP.create(data)

  if (!otpData) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'opt not create')
  }

  await sendEmail(payload?.email, otpCode)
}

export const otpService = {
  otpStoreIntoDB,
}
