import { Router } from 'express'
import { productController } from './product.controller'

const router = Router()

router.post('/', productController.createProduct)

router.patch('/:productId', productController.updateProduct)

router.delete('/:productId', productController.deleteProduct)

export const productRoute = router
