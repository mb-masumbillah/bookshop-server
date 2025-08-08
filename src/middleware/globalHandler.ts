/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'
import config from '../app/config'

const globalHandler: ErrorRequestHandler = (error, req, res, next): void => {
  const statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  const message = error?.message ||  'something want wrong'



  res.status(statusCode).json({
    success: false,
    message,
    err: error,
    stack: config.node_env === 'development' ? error.stack : null,
  })
}

export default globalHandler
