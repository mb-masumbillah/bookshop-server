import { TUser } from '../user/user.interface'

const registerUserIntoService = async (payload: TUser) => {
  return payload
}

export const authService = {
  registerUserIntoService,
}
