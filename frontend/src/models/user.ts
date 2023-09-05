import { LogDto } from "./common"
import { PolicyDto } from "./policy"

export interface UserCreateAccountDto {
  authProvider: string
  name: string
  secret: string
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
  authProvider: number
  name: string
}

export interface UserDto extends LogDto {
  id: number
  name: string
  policies: UserPolicyDto[]
  accounts: AccountDto[]
}
