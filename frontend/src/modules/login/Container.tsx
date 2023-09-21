import { AppLayout } from "@/components/Layout";
import { Card, Col, Divider, Row, Space, Typography } from "antd";
import { CredentialLoginAction } from "./actions/CredentialLogin";
import { GoogleLoginAction } from "./actions/GoogleLogin";
import { MicrosoftLoginAction } from "./actions/MicrosoftLogin";

export const LoginContainer = () => {
  return (
    <AppLayout>
      <Row justify="center">
        <Col lg={8} md={10} sm={14} xs={22}>
          <Card>
            <Typography.Title level={5} style={{ textAlign: "center" }}>
              Authenticate
            </Typography.Title>
            <CredentialLoginAction />

            <Divider>Or</Divider>

            <Row justify="center" gutter={[12, 12]}>
              <Col>
                <GoogleLoginAction />
              </Col>
              <Col>
                <MicrosoftLoginAction />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </AppLayout>
  );
};
