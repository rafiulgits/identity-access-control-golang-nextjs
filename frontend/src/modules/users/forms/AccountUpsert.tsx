import { AccountUpsertDto } from "@/models/user";
import { BaseFormProps } from "@/util/common-props";
import { authProviders } from "@/util/values";
import { Form, Select, Input } from "antd";
import { useMemo } from "react";

interface Props extends BaseFormProps<AccountUpsertDto> {}

export const AccountUpsertForm = (props: Props) => {
  const authProvider = Form.useWatch("authProvider", props.form);
  const hasSecret = useMemo(() => {
    return authProvider === "credential";
  }, [authProvider]);

  return (
    <Form form={props.form} onFinish={props.onSubmit} layout="vertical">
      <Form.Item
        name={"authProvider"}
        rules={[{ required: true, message: "auth method is required" }]}
      >
        <Select
          placeholder="Auth Method"
          options={authProviders.map((i) => ({ label: i, value: i, key: i }))}
        />
      </Form.Item>

      <Form.Item
        name={"name"}
        rules={[{ required: true, message: "email or handler is required" }]}
      >
        <Input placeholder="Email or Handler" />
      </Form.Item>

      {hasSecret && (
        <Form.Item
          name={"secret"}
          rules={[
            {
              required: true,
              message: "password or secret is required for credential auth",
            },
          ]}
        >
          <Input.Password placeholder="Password or Secret" />
        </Form.Item>
      )}
    </Form>
  );
};
