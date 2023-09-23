import { AccountUpsertDto, UserCreateDto, UserUpdateDto } from "@/models/user";
import { AuthenticApi } from "./api-manager";

export const UserApi = {
  create: (data: UserCreateDto) => {
    return AuthenticApi().post("/users", JSON.stringify(data));
  },
  getAll: () => {
    return AuthenticApi().get("/users");
  },
  update: (data: UserUpdateDto) => {
    return AuthenticApi().put(`/users/${data.id}`, JSON.stringify(data));
  },
  delete: (id: number) => {
    return AuthenticApi().delete(`/users/${id}`);
  },
  createAccount: (data: AccountUpsertDto) => {
    return AuthenticApi().post(`/users/${data.userId}/accounts`, JSON.stringify(data))
  },
  updateAccount: (data: AccountUpsertDto) => {
    return AuthenticApi().put(`/users/${data.userId}/accounts/${data.id}`, JSON.stringify(data))
  },
  deleteAccount: (userId: number, accountId: number) => {
    return AuthenticApi().delete(`/users/${userId}/accounts/${accountId}`)
  }
}