import { LogDto } from "./common"
import { PolicyDto } from "./policy"

export interface UserCreateAccountDto {
  authProvider: string
  name: string
  secret: string
}

export interface AccountUpsertDto extends UserCreateAccountDto {
  id: number
  userId: number
}

export interface UserCreateDto {
  name: string
  accounts: UserCreateAccountDto[]
  policyIds: number[]
}


export interface UserPolicyDto {
  policyId: number
  policy: PolicyDto
}

export interface AccountDto {
  id: number
  authProvider: number
  name: string
  userId: number
}


export interface UserDto extends LogDto {
  id: number
  name: string
  policies: UserPolicyDto[]
  accounts: AccountDto[]
}


export interface UserUpdateDto {
  id: number
  name: string
  policyIds: number[]
}