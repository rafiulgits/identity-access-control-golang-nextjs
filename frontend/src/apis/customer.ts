import { CustomerUpsertDto } from "@/models/customer";
import { Api } from "./api-manager";

export const CustomerApi = {
  create: (data: CustomerUpsertDto) => {
    return Api().post("/customers", JSON.stringify(data));
  },
  getAll: () => {
    return Api().get("/customers");
  },
  update: (data: CustomerUpsertDto) => {
    return Api().put(`/customers/${data.id}`, JSON.stringify(data));
  },
  delete: (id: number) => {
    return Api().delete(`/customers/${id}`);
  },
}