import { AppLayout } from "@/components/Layout";
import { GithubFilled, ThunderboltFilled } from "@ant-design/icons";
import { Button, Card, Col, Row, Space } from "antd";
import { NextPage } from "next";

const Page: NextPage = () => {
  return (
    <AppLayout>
      <Row justify="center">
        <Col xl={16} md={18} sm={20} xs={22}>
          <Card
            title={
              <Space>
                <ThunderboltFilled />
                <span>Features & Functionalities</span>
              </Space>
            }
            extra={
              <Button
                type="primary"
                icon={<GithubFilled />}
                href="https://github.com/rafiulgits/identity-access-control-golang-nextjs"
              >
                Source Code
              </Button>
            }
          >
            <ul>
              <li>
                Powerfull Stack: Golang, PostgreSQL, NextJS, OAuth, Restful
              </li>
              <li>
                OAuth & Credential based custom authentication & authorization
              </li>
              <li>Policy based access control</li>
              <li>Back and forth validation and verification</li>
            </ul>
            <br />
          </Card>
        </Col>
      </Row>
    </AppLayout>
  );
};

export default Page;
