import { StatusCodes } from 'http-status-codes'
import { TUser } from './user.interface'
import { User } from './user.model'
import { AppError } from '../../Error/AppError'
import config from '../../config'

const createUserIntoDB = async (password: string, payload: TUser) => {
  const userData: Partial<TUser> = { ...payload }

  userData.password = password || (config.default_password as string)
  userData.role = 'user'
  userData.needsPasswordChange = false

  const user = await User.isUserExistsByCustomEmail(payload.email)

  if (user) {
    throw new AppError(StatusCodes.CONFLICT, 'User is exist')
  }



  


  const result = await User.create(userData)

  return result
}

export const userService = {
  createUserIntoDB,
}
