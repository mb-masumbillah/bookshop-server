/* eslint-disable @typescript-eslint/no-this-alias */
import { model, Schema } from 'mongoose'
import { TOtp } from './otp.interface'
import bcrypt from 'bcrypt'
import config from '../../config'

const otpSchema = new Schema<TOtp>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  otp: { type: String, required: true },
  contactNumbar: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

otpSchema.pre('save', async function (next) {
  const user = this

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(
      user.password,
      Number(config.bcrypt_salt_rounds as string),
    )
  }
  next()
})

otpSchema.post('save', function (doc, next) {
  doc.password = ' '
  next()
})

export const OTP = model<TOtp>('OTP', otpSchema)
