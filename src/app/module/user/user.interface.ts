import { Model } from 'mongoose'

export type TUser = {
  name: string
  email: string
  password: string
  contactNumbar: string
  isPhoneVerified: boolean
  isEmailVerified: boolean
  needsPasswordChange: boolean
  passwordChangedAt?: Date
  role: 'superAdmin' | 'admin' | 'user'
  isActive: 'in-progress' | 'blocked'
  isDeleted: boolean
}

export interface UserModel extends Model<TUser> {
  isUserExistsByCustomEmail(email: string): Promise<TUser>
}
