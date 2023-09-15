import { AccountUpsertDto, UserCreateDto, UserUpdateDto } from "@/models/user";
import { Api } from "./api-manager";

export const UserApi = {
  create: (data: UserCreateDto) => {
    return Api().post("/users", JSON.stringify(data));
  },
  getAll: () => {
    return Api().get("/users");
  },
  update: (data: UserUpdateDto) => {
    return Api().put(`/users/${data.id}`, JSON.stringify(data));
  },
  delete: (id: number) => {
    return Api().delete(`/users/${id}`);
  },
  createAccount: (data: AccountUpsertDto) => {
    return Api().post(`/users/${data.userId}/accounts`, JSON.stringify(data))
  },
  updateAccount: (data: AccountUpsertDto) => {
    return Api().put(`/users/${data.userId}/accounts/${data.id}`, JSON.stringify(data))
  },
  deleteAccount: (userId: number, accountId: number) => {
    return Api().delete(`/users/${userId}/accounts/${accountId}`)
  }
}