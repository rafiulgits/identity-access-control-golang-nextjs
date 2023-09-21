import {
  Layout as AntLayout,
  Avatar,
  Button,
  Col,
  Row,
  Space,
  Typography,
  theme,
} from "antd";
import Link from "next/link";

interface AppLayoutProps {
  children?: React.ReactNode;
  hideTileMenu?: boolean;
}

export const AppLayout = (props: AppLayoutProps) => {
  const themeConfig = theme.useToken();

  return (
    <AntLayout>
      <AntLayout.Header
        style={{
          position: "fixed",
          zIndex: 1,
          width: "100%",
          backgroundColor: themeConfig.token.colorPrimary,
        }}
      >
        <Row justify="space-between">
          <Col>
            <Link href="/">
              <Space direction="horizontal" align="baseline">
                <Avatar
                  style={{ backgroundColor: "white" }}
                  shape="square"
                  size={30}
                  src="/next.svg"
                />
                <Typography.Title style={{ color: "white" }} level={5}>
                  Identity & Access Control
                </Typography.Title>
              </Space>
            </Link>
          </Col>
          <Col>
            <Button>Login</Button>
          </Col>
        </Row>
      </AntLayout.Header>
      <AntLayout style={{ minHeight: "100vh" }}>
        <AntLayout>
          <AntLayout.Content style={{ marginTop: "64px" }}>
            <div
              style={{
                padding: "24px 16px",
                minHeight: 360,
                marginBottom: "5rem",
              }}
            >
              <Row justify="center">
                <Col xxl={22} xl={23} lg={23} md={23} xs={24} sm={24}>
                  {props.children}
                </Col>
              </Row>
            </div>
          </AntLayout.Content>
        </AntLayout>
      </AntLayout>
      <AntLayout.Footer
        style={{
          textAlign: "center",
          padding: "8px 12px",
          background: "white",
        }}
      >
        <small>Open Source</small>
      </AntLayout.Footer>
    </AntLayout>
  );
};
