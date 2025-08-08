import { TUser } from '../user/user.interface'
import { User } from '../user/user.model'

const registerUserIntoService = async (payload: TUser) => {
  const user = await User.isUserExistsByCustomEmail(payload.email)
 
  if (!user) {
    throw new Error('User dose not exist')
  }

  if (user?.isDeleted) {
    throw new Error('user is deleted')
  }

  if (user?.isActive === 'blocked') {
    throw new Error('user is blocked')
  }

  return user
}

export const authService = {
  registerUserIntoService,
}
