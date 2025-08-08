import { model, Schema } from 'mongoose'
import { TOtp } from './otp.interface'

const otpSchema = new Schema<TOtp>({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  name: { type: String },
  contactNumbar: { type: String },
  password: { type: String },
  createdAt: { type: Date, default: Date.now, expires: 60 },
})

export const OTP = model<TOtp>('OTP', otpSchema)
