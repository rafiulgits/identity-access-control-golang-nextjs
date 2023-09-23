import { Api, AuthenticApi } from "./api-manager";
import { PolicyUpsertDto } from "@/models/policy";

export const PolicyApi = {
  create: (data: PolicyUpsertDto) => {
    return AuthenticApi().post("/policies", JSON.stringify(data));
  },
  getAll: () => {
    return AuthenticApi().get("/policies");
  },
  update: (data: PolicyUpsertDto) => {
    return AuthenticApi().put(`/policies/${data.id}`, JSON.stringify(data));
  },
  delete: (id: number) => {
    return AuthenticApi().delete(`/policies/${id}`);
  },
}