
import { LogDto } from "./common"

export interface PermissionDto extends LogDto {
  id: number
  policyId: number
  access: string[]
  module: number
}

export interface PolicyDto extends LogDto {
  id: number
  name: string
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
