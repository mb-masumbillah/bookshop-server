import { Router } from 'express'
import { authRoute } from '../app/module/auth/auth.route'

const router = Router()

const moduleRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
]

moduleRoutes.forEach((route) => router.use(route?.path, route?.route))

// router.use('/auth', authRoute)

export default router
