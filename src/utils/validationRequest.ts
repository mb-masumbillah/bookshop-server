import { ZodObject } from 'zod'
import { catchAsync } from './catchAsync'

export const validationRequest = (schema: ZodObject) => {
  return catchAsync(async (req, res, next) => {
    await schema.parseAsync({ body: req.body })
    next()
  })
}
