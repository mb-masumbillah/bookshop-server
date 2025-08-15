/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from 'http-status-codes'
import { TUser } from './user.interface'
import { User } from './user.model'
import { AppError } from '../../Error/AppError'
import config from '../../config'
import { OTP } from '../otp/otp.model'
import mongoose from 'mongoose'
import { createToken } from '../auth/auth.utils'

const createUserIntoDB = async (mail: string, otp: string) => {
  const userData: Partial<TUser> = {}

  userData.role = 'user'
  userData.needsPasswordChange = false
  userData.isEmailVerified = true

  const session = await mongoose.startSession()

  try {
    session.startTransaction()

    // OTP খুঁজে নিন session এর সাথে
    const existingOTP = await OTP.findOne({ email: mail }).session(session)
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

    // User আগেই আছে কিনা চেক
    const user = await User.isUserExistsByEmailOrNumber(mail)
    if (user) {
      throw new AppError(StatusCodes.CONFLICT, 'User already exists')
    }

    // User create করুন session দিয়ে

    const { name, contactNumbar, password, email } = existingOTP

    userData.name = name
    userData.contactNumbar = contactNumbar
    userData.password = password
    userData.email = email

    const newUser = await User.create([userData], { session })
    if (!newUser.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create user')
    }

    // OTP ডিলিট করুন session দিয়ে
    const deleteResult = await OTP.deleteMany({ email }).session(session)
    if (deleteResult.deletedCount === 0) {
      throw new AppError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed to delete OTP records',
      )
    }

    //create token and sent to the  client
    const jwtPayload = {
      email: newUser[0]?.email,
      role: newUser[0]?.role,
    }

    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expires_in as string,
    )

    const refreshToken = createToken(
      jwtPayload,
      config.jwt_refresh_secret as string,
      config.jwt_refresh_expires_in as string,
    )

    // সব ঠিক থাকলে commit করুন
    await session.commitTransaction()
    await session.endSession()

    return {
      accessToken,
      refreshToken,
      needsPasswordChange: newUser[0]?.needsPasswordChange,
      user: newUser[0],
    }
  } catch (error: any) {
    // error এলে rollback করুন
    await session.abortTransaction()
    await session.endSession()
    throw error
  }
}

const updateUserIntoDB = async (email: string, payload: Partial<TUser>) => {
  const user = await User.isUserExistsByEmailOrNumber(email)
  if (!user) {
    throw new AppError(StatusCodes.CONFLICT, 'User is not exists')
  }

  if (user?.isDeleted) {
    throw new AppError(StatusCodes.FORBIDDEN, 'user is deleted')
  }

  if (user?.isActive === 'blocked') {
    throw new AppError(StatusCodes.FORBIDDEN, 'user is blocked')
  }

  const result = await User.findOneAndUpdate({ email }, payload, {
    new: true,
    runValidators: true,
  })
  return result
}

const deleteUserIntoDB = async (email: string) => {
  const user = await User.isUserExistsByEmailOrNumber(email)
  if (!user) {
    throw new AppError(StatusCodes.CONFLICT, 'User is not exists')
  }

  if (user?.isDeleted) {
    throw new AppError(StatusCodes.FORBIDDEN, 'user is deleted')
  }

  if (user?.isActive === 'blocked') {
    throw new AppError(StatusCodes.FORBIDDEN, 'user is blocked')
  }

  const deleteData: Partial<TUser> = {}
  deleteData.isActive = 'blocked'
  deleteData.isDeleted = true

  const result = await User.findOneAndUpdate({ email }, deleteData, {
    new: true,
    runValidators: true,
  })
  return result
}

export const userService = {
  createUserIntoDB,
  updateUserIntoDB,
  deleteUserIntoDB,
}
