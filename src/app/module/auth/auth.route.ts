import { Router } from 'express'
import { authController } from './auth.controller'
import auth from '../../../middleware/auth'
import { USER_ROLE } from '../user/user.constant'

const router = Router()

router.post('/login', authController.loginUser)

router.post(
  '/change-password',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.user),
  authController.changePassword,
)

router.post('/refresh-token', authController.refreshToken)

export const authRoute = router
