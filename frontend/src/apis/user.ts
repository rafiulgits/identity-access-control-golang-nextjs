import { UserCreateDto } from "@/models/user";
import { Api } from "./api-manager";

export const UserApi = {
  create: (data: UserCreateDto) => {
    return Api().post("/users", JSON.stringify(data));
  },
  getAll: () => {
    return Api().get("/users");
  },
  update: (data: any) => {
    return Api().put(`/users/${data.id}`, JSON.stringify(data));
  },
  delete: (id: number) => {
    return Api().delete(`/users/${id}`);
  },
}