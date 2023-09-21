import { Api } from "./api-manager"

export const AuthApi = {
  credentialLogin: (data: any) => {
    return Api().post("/auth/login/credential", JSON.stringify(data));
  }
}