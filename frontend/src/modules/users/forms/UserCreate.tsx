import { UserCreateDto } from "@/models/user";
import { useAppSelector } from "@/store/hook";
import { BaseFormProps } from "@/util/common-props";
import { authProviders } from "@/util/values";
import { DeleteFilled } from "@ant-design/icons";
import {
  Button,
  Col,
  Divider,
  Form,
  FormInstance,
  Input,
  Row,
  Select,
} from "antd";
import { useMemo } from "react";

interface UserCreateFormProps extends BaseFormProps<UserCreateDto> {}

export const UserCreateForm = (props: UserCreateFormProps) => {
  const policies = useAppSelector((s) => s.policy.entities);

  return (
    <Form form={props.form} onFinish={props.onSubmit} layout="vertical">
      <Form.Item name={"name"} label="Name" rules={[{ required: true }]}>
        <Input placeholder="Full Name" />
      </Form.Item>
      <Divider>Assign Permissions</Divider>
      <Form.Item name="policyIds">
        <Select
          mode="multiple"
          placeholder="Policies"
          options={policies.map((p) => ({
            label: p.name,
            value: p.id,
            key: p.id,
          }))}
        />
      </Form.Item>
      <Divider>Accounts</Divider>
      <Form.List name={"accounts"}>
        {(fields, { add, remove }) => (
          <div>
            <div>
              <Button type="dashed" onClick={() => add()}>
                Add Account
              </Button>
            </div>
            <br />
            {fields.map((field) => (
              <UserAccountListItemForm
                form={props.form}
                index={field.name}
                onRemove={remove}
              />
            ))}
          </div>
        )}
      </Form.List>
    </Form>
  );
};

interface UserAccountListItemFormProps {
  form: FormInstance;
  index: number;
  onRemove: (index: number) => void;
}

const UserAccountListItemForm = (props: UserAccountListItemFormProps) => {
  const { index, form, onRemove } = props;

  const authProviderVal = Form.useWatch(
    ["accounts", index, "authProvider"],
    form
  );

  const hasSecret = useMemo(() => {
    return (
      typeof authProviderVal === "string" && authProviderVal === "credential"
    );
  }, [authProviderVal]);

  return (
    <Row gutter={[6, 6]}>
      <Col span={6}>
        <Form.Item
          name={[index, "authProvider"]}
          rules={[{ required: true, message: "auth method is required" }]}
        >
          <Select
            placeholder="Auth Method"
            options={authProviders.map((i) => ({ label: i, value: i, key: i }))}
          />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name={[index, "name"]}
          rules={[{ required: true, message: "email or handler is required" }]}
        >
          <Input placeholder="Email or Handler" />
        </Form.Item>
      </Col>
      {hasSecret && (
        <Col span={8}>
          <Form.Item
            name={[index, "secret"]}
            rules={[
              {
                required: true,
                message: "password or secret is required for credential auth",
              },
            ]}
          >
            <Input.Password placeholder="Password or Secret" />
          </Form.Item>
        </Col>
      )}
      <Col span={2}>
        <Button
          icon={<DeleteFilled />}
          danger
          onClick={() => {
            onRemove(index);
          }}
        />
      </Col>
    </Row>
  );
};
