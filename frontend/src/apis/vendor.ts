import { VendorUpsertDto } from "@/models/vendor";
import { Api } from "./api-manager";

export const VendorApi = {
  create: (data: VendorUpsertDto) => {
    return Api().post("/vendors", JSON.stringify(data));
  },
  getAll: () => {
    return Api().get("/vendors");
  },
  update: (data: VendorUpsertDto) => {
    return Api().put(`/vendors/${data.id}`, JSON.stringify(data));
  },
  delete: (id: number) => {
    return Api().delete(`/vendors/${id}`);
  },
}