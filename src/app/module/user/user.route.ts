import { Router } from 'express'
import { userController } from './user.controller'
import { otpvalidation } from '../otp/opt.validation'
import { validationRequest } from '../../../middleware/validationRequest'
import { userUpdateValidationSchema } from './user.validation'

const router = Router()

router.post(
  '/create-user',
  validationRequest(otpvalidation),
  userController.createUser,
)

router.patch(
  '/:email',
  validationRequest(userUpdateValidationSchema),
  userController.updateUser,
)

router.delete('/:email', userController.deleteUser)

export const userRoute = router
