import { LogDto } from "./common";

export interface ProductUpsertDto {
  id: number;
  name: string;
  code: string;
  price: number;
}
export interface ProductDto extends ProductUpsertDto, LogDto { }
