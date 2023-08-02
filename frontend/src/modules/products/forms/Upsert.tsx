import { ProductUpsertDto } from "@/models/product";
import { BaseFormProps } from "@/util/common-props";
import { Form, Row, Col, Input, InputNumber } from "antd";

interface Props extends BaseFormProps<ProductUpsertDto> {}

export const ProductUpsertForm = (props: Props) => {
  return (
    <Form layout="vertical" form={props.form} onFinish={props.onSubmit}>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, max: 80 }]}
          >
            <Input placeholder="My Product" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Code"
            name="code"
            rules={[{ required: true, max: 10 }]}
          >
            <Input placeholder="P10001" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Price"
            name="price"
            rules={[
              {
                required: true,
                validator(_, value) {
                  if (typeof value !== "number") {
                    return Promise.reject("please enter valid price");
                  }
                  if (Number(value) <= 0) {
                    return Promise.reject("price shouldn't be zero");
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber placeholder="100" style={{ width: "100%" }} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
