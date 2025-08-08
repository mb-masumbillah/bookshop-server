import { StatusCodes } from 'http-status-codes'
import { TUser } from './user.interface'
import { User } from './user.model'
import { AppError } from '../../Error/AppError'
import config from '../../config'
import { OTP } from '../otp/otp.model'

const createUserIntoDB = async (
  password: string,
  payload: TUser,
  otp: string,
) => {
  const userData: Partial<TUser> = { ...payload }

  userData.password = password || (config.default_password as string)
  userData.role = 'user'
  userData.needsPasswordChange = false

  const existingOTP = await OTP.findOne({ email: payload?.email })

    if (!existingOTP) {
    throw new AppError(StatusCodes.CONFLICT, 'email is not exist')
  }

  if (existingOTP?.otp !== otp) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'otp not match')
  }

  const user = await User.isUserExistsByCustomEmail(payload?.email)


  if (user) {
    throw new AppError(StatusCodes.CONFLICT, 'User is exist')
  }

  const result = await User.create(userData)

  if (result) {
    await OTP.deleteMany({ email: payload?.email })
  }

  return result
}

export const userService = {
  createUserIntoDB,
}
