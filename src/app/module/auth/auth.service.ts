
import { User } from '../user/user.model'
import { TLoginUser } from './auth.interface'

const loginUserIntoService = async (payload: TLoginUser) => {
  

const user = await User.isUserExistsByCustomEmail({email: payload?.email})


  
}

export const authService = {
loginUserIntoService,
}
