
import { LogDto } from "./common"

export interface PermissionDto extends LogDto {
  id: number
  policyId: number
  access: string[]
  module: number
}

export interface PolicyBaseDto {
  id: number
  name: string
}
export interface PolicyDto extends PolicyBaseDto, LogDto {
  permissions: Array<PermissionDto>
}

export interface PolicyUpsertDto {
  id: number
  name: string
  permissions: Array<PolicyUpsertPermissionDto>
}

export interface PolicyUpsertPermissionDto {
  access: string[]
  module: string
}
