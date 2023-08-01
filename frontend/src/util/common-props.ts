import { FormInstance } from "antd";

export interface BaseFormProps<T> {
  form: FormInstance;
  onSubmit: (data: T) => void;
}
