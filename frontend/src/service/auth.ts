import axios from "axios";
import { CredentialLoginDto, OAuthDto } from "@/models/auth";
import { ApiServer } from "@/util/env-values";
import { MemoryManager } from "@/util/memory-manager";
import { Keys } from "@/util/keys";

const throwAxiosError = (err: any) => {
  if (!!err.response) {
    if (!!err.response.data && !!err.response.data["message"]) {
      throw new Error(err.response.data["message"]);
    }
    throw new Error(err.message);
  }
  throw new Error("failed to perform request");
};

export const AuthService = {
  googleLogin: async (data: OAuthDto) => {
    try {
      const res = await axios.post(
        `${ApiServer}/auth/login/google`,
        JSON.stringify(data),
        {
          headers: { "Content-Type": "application/json" }
        }
      );
      return res.data;
    } catch (err: any) {
      throwAxiosError(err);
    }
  },

  credentialLogin: async (data: CredentialLoginDto) => {
    try {
      const res = await axios.post(
        `${ApiServer}/auth/login/credential`,
        JSON.stringify(data),
        {
          headers: { "Content-Type": "application/json" }
        }
      );
      return res.data;
    } catch (err: any) {
      throwAxiosError(err);
    }
  },


  getProfile: async (accessToken: string) => {
    try {
      const res = await axios.get(`${ApiServer}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return res.data;
    } catch (err: any) {
      throwAxiosError(err);
    }
  },
};
