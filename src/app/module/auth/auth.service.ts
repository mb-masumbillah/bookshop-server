import { TUser } from '../user/user.interface'

const registerUserIntoService = (payload: TUser) => {
  return payload
}

export const authService = {
  registerUserIntoService,
}
