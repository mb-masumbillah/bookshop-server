import z from 'zod'

export const otpvalidation = z.object({
  body: z.object({
    email: z.email('Invalid email format'),
    otp: z.string('invalid otp'),
  }),
})

export const resendValidation = z.object({
  body: z.object({
    email: z.email('Invalid email format'),
  }),
})
