import { ProductUpsertDto } from "@/models/product";
import { Api } from "./api-manager";

export const ProductApi = {
  create: (data: ProductUpsertDto) => {
    return Api().post("/products", JSON.stringify(data));
  },
  getAll: () => {
    return Api().get("/products");
  },
  update: (data: ProductUpsertDto) => {
    return Api().put(`/products/${data.id}`, JSON.stringify(data));
  },
  delete: (id: number) => {
    return Api().delete(`/products/${id}`);
  },
}