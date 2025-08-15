import { Router } from 'express'
import { authController } from './auth.controller'
import auth from '../../../middleware/auth'
import { USER_ROLE } from '../user/user.constant'
import { validationRequest } from '../../../middleware/validationRequest'
import { authValidation } from './auth.validation'

const router = Router()

router.post(
  '/login',
  validationRequest(authValidation.authValidationUser),
  authController.loginUser,
)

router.post(
  '/change-password',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.user),
  validationRequest(authValidation.changePasswordValidationSchema),
  authController.changePassword,
)

router.post(
  '/refresh-token',
  validationRequest(authValidation.refreshTokenValidationSchema),
  authController.refreshToken,
)

router.post(
  '/forget-password',
  validationRequest(authValidation.forgetTokenValidationSchema),
  authController.forgetPassword,
)

router.post(
  '/reset-password',
  validationRequest(authValidation.resetPasswordValidationSchema),
  authController.resetPasswrod,
)

export const authRoute = router
