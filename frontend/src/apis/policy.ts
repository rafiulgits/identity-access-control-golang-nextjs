import { Api } from "./api-manager";
import { PolicyUpsertDto } from "@/models/policy";

export const PolicyApi = {
  create: (data: PolicyUpsertDto) => {
    return Api().post("/policies", JSON.stringify(data));
  },
  getAll: () => {
    return Api().get("/policies");
  },
  update: (data: PolicyUpsertDto) => {
    return Api().put(`/policies/${data.id}`, JSON.stringify(data));
  },
  delete: (id: number) => {
    return Api().delete(`/policies/${id}`);
  },
}