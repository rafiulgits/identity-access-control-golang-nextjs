import { VendorUpsertDto } from "@/models/vendor";
import { AuthenticApi } from "./api-manager";

export const VendorApi = {
  create: (data: VendorUpsertDto) => {
    return AuthenticApi().post("/vendors", JSON.stringify(data));
  },
  getAll: () => {
    return AuthenticApi().get("/vendors");
  },
  update: (data: VendorUpsertDto) => {
    return AuthenticApi().put(`/vendors/${data.id}`, JSON.stringify(data));
  },
  delete: (id: number) => {
    return AuthenticApi().delete(`/vendors/${id}`);
  },
}