import { CustomerUpsertDto } from "@/models/customer";
import { BaseFormProps } from "@/util/common-props";
import { Form, Row, Col, Input } from "antd";

interface Props extends BaseFormProps<CustomerUpsertDto> {}

export const CustomerUpsertForm = (props: Props) => {
  return (
    <Form layout="vertical" form={props.form} onFinish={props.onSubmit}>
      <Row gutter={[8, 8]}>
        <Col md={10} sm={24}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, max: 80 }]}
          >
            <Input placeholder="AB Traders" />
          </Form.Item>
        </Col>
        <Col md={6} sm={24}>
          <Form.Item
            label="Code"
            name="code"
            rules={[{ required: true, max: 20 }]}
          >
            <Input placeholder="C10001" />
          </Form.Item>
        </Col>
        <Col md={8} sm={24}>
          <Form.Item label="Phone" name="phone" rules={[{ max: 20 }]}>
            <Input placeholder="+8801XXXXXXXX" />
          </Form.Item>
        </Col>
        <Col sm={24}>
          <Form.Item label="Address" name="address" rules={[{ max: 100 }]}>
            <Input placeholder="Street, City, Country" />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
