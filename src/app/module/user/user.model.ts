import { model, Schema } from 'mongoose'
import { TUser } from './user.interface'
import { role, userStatus } from './user.constant'

const userSchema = new Schema<TUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
       lowercase: true,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  contactNumbar: {
    type: String,
    required: true,
    unique: true,
  },
  isPhoneVerified: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: true,
  },
  needsPasswordChange: {
    type: Boolean,
    default: true,
  },
  passwordChangedAt: {
    type: Date,
  },
  role: {
    type: String,
    enum: [...role],
    default: 'user',
  },
  isActive: {
    type: String,
    enum: [...userStatus],
    default: 'in-progress',
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
})

export const User = model<TUser>('User', userSchema)
