import { ProductUpsertDto } from "@/models/product";
import { AuthenticApi } from "./api-manager";

export const ProductApi = {
  create: (data: ProductUpsertDto) => {
    return AuthenticApi().post("/products", JSON.stringify(data));
  },
  getAll: () => {
    return AuthenticApi().get("/products");
  },
  update: (data: ProductUpsertDto) => {
    return AuthenticApi().put(`/products/${data.id}`, JSON.stringify(data));
  },
  delete: (id: number) => {
    return AuthenticApi().delete(`/products/${id}`);
  },
}