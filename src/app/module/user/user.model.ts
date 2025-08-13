/* eslint-disable @typescript-eslint/no-this-alias */
import { model, Schema } from 'mongoose'
import { TUser, UserModel } from './user.interface'
import { role, userStatus } from './user.constant'
import config from '../../config'
import bcrypt from 'bcrypt'

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

// userSchema.pre('save', async function (next) {
//   const user = this

//   if (user) {
//     user.password = await bcrypt.hash(
//       user.password,
//       Number(config.bcrypt_salt_rounds as string),
//     )
//   }
//   next()
// })

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
  console.log({plainTextPassword}, {hashedPassword})
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
