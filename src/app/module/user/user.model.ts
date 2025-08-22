import { model, Schema } from 'mongoose'
import { TUser, UserModel } from './user.interface'
import { role, userStatus } from './user.constant'
import bcrypt from 'bcrypt'

const userSchema = new Schema<TUser, UserModel>(
  {
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
  },
  { timestamps: true },
)

userSchema.post('save', function (doc, next) {
  doc.password = ' '
  next()
})

userSchema.statics.isUserExistsByEmailOrNumber = async function (
  identifier: string,
) {
  return await this.findOne({
    $or: [{ email: identifier }, { contactNumbar: identifier }],
  }).select('+password')
}

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword: string,
  hashedPassword: string,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword)
}

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000

  return passwordChangedTime > jwtIssuedTimestamp
}

export const User = model<TUser, UserModel>('User', userSchema)
