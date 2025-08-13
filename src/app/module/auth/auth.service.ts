import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../Error/AppError'
import { User } from '../user/user.model'
import { TLoginUser } from './auth.interface'
import { createToken, verifyToken } from './auth.utils'
import config from '../../config'
import { JwtPayload } from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const loginUserIntoService = async (payload: TLoginUser) => {
  let user = null

  if (payload.email) {
    user = await User.isUserExistsByEmailOrNumber(payload.email)
  }

  if (payload?.contactNumbar) {
    user = await User.isUserExistsByEmailOrNumber(payload.contactNumbar)
  }

  if (!user) {
    throw new AppError(StatusCodes.CONFLICT, 'User is not exists')
  }

  if (user.isDeleted) {
    throw new AppError(StatusCodes.FORBIDDEN, 'This user is deleted')
  }

  if (user.isActive === 'blocked') {
    throw new AppError(StatusCodes.FORBIDDEN, 'This user is blocked')
  }

  if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
    throw new AppError(StatusCodes.FORBIDDEN, 'Password do not match')
  }

  const jwtPayload = {
    email: user?.email,
    role: user?.role,
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

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: user?.needsPasswordChange,
  }
}

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  const user = await User.isUserExistsByEmailOrNumber(userData?.email)

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'this is user is not exist')
  }

  if (user?.isDeleted) {
    throw new AppError(StatusCodes.FORBIDDEN, 'user is deleted')
  }

  if (user?.isActive === 'blocked') {
    throw new AppError(StatusCodes.FORBIDDEN, 'user is blocked')
  }

  if (!(await User.isPasswordMatched(payload?.oldPassword, user?.password))) {
    throw new AppError(StatusCodes.FORBIDDEN, 'password do not match')
  }

  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  )

  await User.findOneAndUpdate(
    {
      email: user?.email,
      role: user?.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  )

  return null
}

const refreshToken = async (token: string) => {
  const decoded = verifyToken(token, config.jwt_refresh_secret as string)

  const { email, iat } = decoded

  const user = await User.isUserExistsByEmailOrNumber(email)

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'user not exists')
  }

  if (user?.isDeleted) {
    throw new AppError(StatusCodes.FORBIDDEN, 'user is deleted')
  }

  if (user?.isActive === 'blocked') {
    throw new AppError(StatusCodes.FORBIDDEN, 'user is blocked')
  }

  if (
    user?.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChanged(
      user?.passwordChangedAt,
      iat as number,
    )
  ) {
    throw new AppError(StatusCodes.FORBIDDEN, 'you are not authorizated !')
  }

  const jwtPayload = {
    email: user?.email,
    role: user?.role,
  }

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  )

  return {
    accessToken,
  }
}

const forgetPassword = async (email:string) =>{
console.log(email)
}

export const authService = {
  loginUserIntoService,
  changePassword,
  refreshToken,
  forgetPassword
}
