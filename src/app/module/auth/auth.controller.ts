import { Request, Response } from 'express'
import { authService } from './auth.service'

const registerUser = async (req: Request, res: Response) => {
  const result = await authService.registerUserIntoService(req.body)
  console.log(result)
}

export const authController = {
  registerUser,
}
