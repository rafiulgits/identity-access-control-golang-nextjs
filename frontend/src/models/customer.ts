import { LogDto } from "./common";


export interface CustomerUpsertDto {
  id: number;
  name: string;
  code: string;
  phone: string;
  address: string;
}

export interface CustomerDto extends CustomerUpsertDto, LogDto {

}