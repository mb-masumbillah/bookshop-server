import { Router } from 'express'
import { authController } from './auth.controller'

const router = Router()

router.post('/login', authController.loginUser)

router.post('/change-password', authController.changePassword)

router.post('/refresh-token', authController.refreshToken)

export const authRoute = router
