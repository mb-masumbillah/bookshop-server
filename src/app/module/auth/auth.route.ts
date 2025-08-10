import { Router } from 'express'
import { authController } from './auth.controller'

import { userValidationSchema } from '../user/user.validation'
import { validationRequest } from '../../../middleware/validationRequest'

const router = Router()

router.post(
  '/register',
  validationRequest(userValidationSchema),
  authController.loginUser,
)

export const authRoute = router
