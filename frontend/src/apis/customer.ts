import { CustomerUpsertDto } from "@/models/customer";
import { AuthenticApi } from "./api-manager";

export const CustomerApi = {
  create: (data: CustomerUpsertDto) => {
    return AuthenticApi().post("/customers", JSON.stringify(data));
  },
  getAll: () => {
    return AuthenticApi().get("/customers");
  },
  update: (data: CustomerUpsertDto) => {
    return AuthenticApi().put(`/customers/${data.id}`, JSON.stringify(data));
  },
  delete: (id: number) => {
    return AuthenticApi().delete(`/customers/${id}`);
  },
}