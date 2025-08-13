import { StatusCodes } from 'http-status-codes'
import { AppError } from '../app/Error/AppError'
import { TUserRole } from '../app/module/user/user.interface'
import { catchAsync } from '../utils/catchAsync'
import config from '../app/config'
import { JwtPayload } from 'jsonwebtoken'
import jwt from 'jsonwebtoken'
import { User } from '../app/module/user/user.model'

const auth = (...requiredRole: TUserRole[]) => {
  return catchAsync(async (req, res, next) => {
    const token = req.headers.authorization

    if (!token) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'you are not authorized')
    }

    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload

    const { email, role, iat } = decoded

    const user = await User.isUserExistsByEmailOrNumber(email)

    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, 'your is not exist')
    }

    if (user.isDeleted) {
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

    if (requiredRole && !requiredRole.includes(role)) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'your are not authorizated')
    }

    req.user = decoded as JwtPayload

    next()
  })
}

export default auth
