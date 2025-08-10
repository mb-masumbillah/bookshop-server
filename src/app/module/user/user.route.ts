import { Router } from 'express'
import { userController } from './user.controller'
import { otpvalidation } from '../otp/opt.validation'
import { validationRequest } from '../../../middleware/validationRequest'

const router = Router()

router.post(
  '/create-user',
  validationRequest(otpvalidation),
  userController.createUser,
)

export const userRoute = router
