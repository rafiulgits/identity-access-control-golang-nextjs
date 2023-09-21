import { BaseFormProps } from "@/util/common-props";
import { Form, Input } from "antd";

interface Props extends BaseFormProps<any> {}

export const LoginForm = (props: Props) => {
  return (
    <Form layout="vertical" form={props.form} onFinish={props.onSubmit}>
      <Form.Item name={"name"} label="Email/ID">
        <Input placeholder="your user name or email" />
      </Form.Item>
      <Form.Item name="secret" label="Password/Secret">
        <Input.Password name="password" placeholder="your secret or password" />
      </Form.Item>
    </Form>
  );
};
