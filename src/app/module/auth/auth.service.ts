import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../Error/AppError'
import { User } from '../user/user.model'
import { TLoginUser } from './auth.interface'
import { createToken, verifyToken } from './auth.utils'
import config from '../../config'

const loginUserIntoService = async (payload: TLoginUser) => {
  let user = null

  if (payload?.email) {
    user = await User.isUserExistsByCustomEmail(payload.email as string)
  } else if (payload?.contactNumbar) {
    user = await User.findOne({
      contactNumbar: payload?.contactNumbar,
    })
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
    user:
      (user?.email && user?.email) ||
      (user?.contactNumbar && user?.contactNumbar),
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

const refreshToken = async (token: string) => {
  const decoded = verifyToken(token, config.jwt_refresh_secret as string)

  const { user: email, iat } = decoded

  const user = await User.isUserExistsByCustomEmail(email)

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
    user: user?.email,
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



export const authService = {
  loginUserIntoService,
  refreshToken,
}
