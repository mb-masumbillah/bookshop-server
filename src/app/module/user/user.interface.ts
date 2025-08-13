import { Model } from 'mongoose'

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
  isUserExistsByCustomEmail(email: string): Promise<TUser>

  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<TUser>

  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean
}
