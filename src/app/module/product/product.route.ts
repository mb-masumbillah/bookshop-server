import { Router } from 'express'
import { productController } from './product.controller'

const router = Router()

router.post('/', productController.createProduct)

export const productRoute = router
