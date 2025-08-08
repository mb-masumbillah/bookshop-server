import { Router } from 'express'
import { authController } from './auth.controller'
import { validationRequest } from '../../../utils/validationRequest'
import { userValidationSchema } from '../user/user.validation'

const router = Router()

router.post(
  '/register',
  validationRequest(userValidationSchema),
  authController.loginUser,
)

export const authRoute = router
