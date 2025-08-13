import { Model } from 'mongoose'
import { USER_ROLE } from './user.constant'

export type TUser = {
  name: string
  email: string
  password: string
  contactNumbar: string
  isEmailVerified: boolean
  needsPasswordChange: boolean
  passwordChangedAt?: Date
  role: 'superAdmin' | 'admin' | 'user'
  isActive: 'in-progress' | 'blocked'
  isDeleted: boolean
}

export interface UserModel extends Model<TUser> {
  isUserExistsByEmailOrNumber(identifier: string): Promise<TUser>

  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<TUser>

  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean
}

export type TUserRole = keyof typeof USER_ROLE
