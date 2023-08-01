import { ApiServer } from "@/util/env-values";
import { HttpResponseError, HttpRequestError } from "@/util/errors";
import { Keys } from "@/util/keys";
import { MemoryManager } from "@/util/memory-manager";
import axios, { AxiosResponse, AxiosError, AxiosInstance } from "axios";

const handleSuccessfulRequest = (response: AxiosResponse): AxiosResponse =>
  response;

const handleFailedRequest = async (err: AxiosError) => {
  if (err.response) {
    if (err.response.data && (err.response.data as any)["message"]) {
      throw new HttpResponseError(
        (err.response.data as any)["message"],
        err.response.status,
        err,
        (err.response.data as any)["fields"]
      );
    }
    throw new HttpResponseError(
      err.message,
      err.response.status,
      err,
      undefined
    );
  }
  throw new HttpRequestError("failed to perform request", err);
};

export function WithInterceptors(axios: AxiosInstance) {
  axios.interceptors.response.use(handleSuccessfulRequest, handleFailedRequest);
  return axios;
}

export const Api = () =>
  WithInterceptors(
    axios.create({
      baseURL: ApiServer,
      headers: { "Content-Type": "application/json" },
    })
  );

export const AuthenticApi = () =>
  WithInterceptors(
    axios.create({
      baseURL: ApiServer,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MemoryManager.getItem(Keys.BearerToken)}`,
      },
    })
  );
