import { Router } from 'express'
import { optController } from './opt.controller'
import { userValidationSchema } from '../user/user.validation'
import { resendValidation } from './opt.validation'
import { validationRequest } from '../../../middleware/validationRequest'

const router = Router()

router.post(
  '/send-otp',
  validationRequest(userValidationSchema),
  optController.sendOTP,
)

router.post(
  '/resend-otp',
  validationRequest(resendValidation),
  optController.updateOtp,
)

export const optRoute = router
