import { Router } from 'express'
import { authRoute } from '../app/module/auth/auth.route'
import { userRoute } from '../app/module/user/user.route'

const router = Router()

const moduleRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/user',
    route: userRoute,
  },
]

moduleRoutes.forEach((route) => router.use(route?.path, route?.route))

// router.use('/auth', authRoute)

export default router
