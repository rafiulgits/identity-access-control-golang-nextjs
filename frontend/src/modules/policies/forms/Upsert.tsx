import { PolicyUpsertDto } from "@/models/policy";
import { BaseFormProps } from "@/util/common-props";
import { modules, permissions } from "@/util/values";
import { DeleteFilled, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Row, Select } from "antd";

interface Props extends BaseFormProps<PolicyUpsertDto> {}

export const PolicyUpsertForm = (props: Props) => {
  return (
    <Form form={props.form} onFinish={props.onSubmit}>
      <Form.Item name="name" rules={[{ required: true }]}>
        <Input placeholder="Policy Name" />
      </Form.Item>

      <Form.List name={"permissions"}>
        {(fields, { add, remove }) => (
          <>
            {fields.map((field) => (
              <Row gutter={[6, 6]} key={field.name}>
                <Col span={6}>
                  <Form.Item
                    rules={[{ required: true }]}
                    name={[field.name, "module"]}
                  >
                    <Select
                      placeholder="Select Module"
                      options={modules.map((m) => ({ label: m, value: m }))}
                    />
                  </Form.Item>
                </Col>
                <Col span={15}>
                  <Form.Item
                    rules={[{ required: true }]}
                    name={[field.name, "access"]}
                  >
                    <Select
                      placeholder="Permissions"
                      options={permissions}
                      mode="multiple"
                    />
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item>
                    <Button
                      danger
                      icon={<DeleteFilled />}
                      onClick={() => {
                        remove(field.name);
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            ))}
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={() => {
                add();
              }}
            >
              Add Permission
            </Button>
          </>
        )}
      </Form.List>
    </Form>
  );
};
