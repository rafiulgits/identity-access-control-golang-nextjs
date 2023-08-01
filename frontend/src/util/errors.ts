import { AxiosError } from "axios";

export class HttpResponseError extends Error {
  public httpStatusCode: number;
  public innerError: AxiosError;
  public fields: Array<object>;
  constructor(
    message: string,
    httpStatusCode: number,
    innerError: AxiosError,
    fields: any
  ) {
    super(message);
    this.httpStatusCode = httpStatusCode;
    this.innerError = innerError;
    this.fields = fields;
  }

  getFieldErrorMessages() {
    let errs = new Array<string>();
    this.fields?.forEach((f) => {
      Object.entries(f).forEach(([k, v]) => {
        errs.push(`${k}: ${v}`);
      });
    });
    return errs;
  }
}

export class HttpRequestError extends Error {
  public innerError: AxiosError;
  constructor(message: string, innerError: AxiosError) {
    super(message);
    this.innerError = innerError;
  }
}

export class ApiError extends Error {
  public err: any;
  constructor(err: any) {
    super(err.message);
    this.err = err;
  }

  isResponseError() {
    return this.err instanceof HttpResponseError;
  }

  asResponseError() {
    return this.err as HttpResponseError;
  }

  asRequestError() {
    return this.err as HttpRequestError;
  }
}
