export type TUser = {
  name: string
  email: string
  password: string
  needsPasswordChange: boolean
  passwordChangedAt?: Date
  role: 'superAdmin' | 'admin' | 'user'
  isActive: 'in-progress' | 'blocked'
  isDeleted: boolean
}
