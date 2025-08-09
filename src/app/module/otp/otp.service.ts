/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from 'http-status-codes'
import { generateOTP } from '../../../utils/otp/generateOTP'
import { TOtp } from './otp.interface'
import { OTP } from './otp.model'
import { User } from '../user/user.model'
import { AppError } from '../../Error/AppError'
import sendEmail from '../../../utils/otp/sendEmail'

const otpExpireSeconds = 60

const otpStoreIntoDB = async (password: string, payload: TOtp) => {
  const data: Partial<TOtp> = { ...payload, password }
  const otpCode = generateOTP()

  data.otp = otpCode
  data.expireAt = new Date(Date.now() + otpExpireSeconds * 1000)

  const user = await User.isUserExistsByCustomEmail(payload.email)
  if (user) {
    throw new AppError(StatusCodes.CONFLICT, 'User already exists')
  }

  const existingOtp = await OTP.findOne({ email: payload?.email })

  if (existingOtp) {
    return { email: payload?.email }
  }

  const result = await OTP.create(data)

  // Send OTP email
  try {
    await sendEmail(payload.name, payload.email, otpCode, otpExpireSeconds)
  } catch (error) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to send OTP email',
    )
  }

  return {
    otpExpireInSeconds: otpExpireSeconds,
    email: result?.email,
  }
}

const resendOtpUpdateIntoDB = async (email: string) => {
  const otpCode = generateOTP()
  const expireAt = new Date(Date.now() + otpExpireSeconds * 1000)

  const existingEmail = await OTP.findOne({ email })

  if (!existingEmail) {
    throw new AppError(StatusCodes.CONFLICT, 'Email is not exist')
  }

  const updatedOtp = await OTP.findOneAndUpdate(
    { email },
    { otp: otpCode, expireAt, createdAt: new Date() },
    { new: true },
  )

  if (!updatedOtp) {
    throw new AppError(StatusCodes.NOT_FOUND, 'OTP not found for this email')
  }

  try {
    await sendEmail(
      updatedOtp.name,
      updatedOtp.email,
      otpCode,
      otpExpireSeconds,
    )
  } catch (error) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to resend OTP email',
    )
  }

  return {
    otpExpireInSeconds: otpExpireSeconds,
    email: updatedOtp?.email,
  }
}

export const otpService = {
  otpStoreIntoDB,
  resendOtpUpdateIntoDB,
}
