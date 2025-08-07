import z from 'zod'

export const authValidationUser = z.object({
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
