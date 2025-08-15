import z from 'zod'

const authValidationUser = z.object({
  body: z
    .object({
      contactNumber: z
        .string()
        .regex(/^\+\d{10,15}$/, 'Invalid contact number format')
        .optional(),

      email: z.email({ message: 'Invalid email format' }).optional(),

      password: z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(
          /[@$!%*?&]/,
          'Password must contain at least one special character',
        ),
    })
    .refine((data) => data.contactNumber || data.email, {
      message: 'Either contactNumber or email is required',
      path: ['contactNumber'],
    }),
})

const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({ message: 'Old password is required.' }),
    newPassword: z.string({ message: 'New Password is required' }),
  }),
})

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      message: 'Refresh Token is required',
    }),
  }),
})

const forgetTokenValidationSchema = z.object({
  body: z.object({
    email: z.email({
      message: 'id is required',
    }),
  }),
})

const resetPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string({
      message: 'User id is required!',
    }),
    newPassword: z.string({
      message: 'User password is required!',
    }),
  }),
})

export const authValidation = {
  authValidationUser,
  changePasswordValidationSchema,
  refreshTokenValidationSchema,
  forgetTokenValidationSchema,
  resetPasswordValidationSchema,
}
