import { model, Schema } from 'mongoose'
import { TUser, UserModel } from './user.interface'
import { role, userStatus } from './user.constant'

const userSchema = new Schema<TUser, UserModel>({
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
    select: 0,
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

userSchema.post('save', function (doc, next) {
  doc.password = ' '
  next()
})

userSchema.statics.isUserExistsByCustomEmail = async function (email: string) {
  return await User.findOne({ email })
}

export const User = model<TUser, UserModel>('User', userSchema)
