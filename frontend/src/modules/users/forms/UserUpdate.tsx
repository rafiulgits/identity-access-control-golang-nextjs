import { UserUpdateDto } from "@/models/user";
import { useAppSelector } from "@/store/hook";
import { BaseFormProps } from "@/util/common-props";
import { Form, Input, Select, Row, Col } from "antd";

interface Props extends BaseFormProps<UserUpdateDto> {}

export const UserUpdateForm = (props: Props) => {
  const policies = useAppSelector((s) => s.policy.entities);

  return (
    <Form form={props.form} onFinish={props.onSubmit} layout="horizontal">
      <Row gutter={[12, 12]}>
        <Col lg={10} md={10} sm={24} xs={24}>
          <Form.Item name={"name"} label="Name" rules={[{ required: true }]}>
            <Input placeholder="Full Name" />
          </Form.Item>
        </Col>
        <Col lg={14} md={14} sm={24} xs={24}>
          <Form.Item label="Permissions" name="policyIds">
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
        </Col>
      </Row>
    </Form>
  );
};
