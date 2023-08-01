import { LogDto } from "./common";


export interface VendorUpsertDto {
  id: number;
  name: string;
  code: string;
  phone: string;
  address: string;
}

export interface VendorDto extends VendorUpsertDto, LogDto {
}