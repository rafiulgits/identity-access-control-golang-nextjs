import { AppLayout } from "@/components/Layout";
import { useUser } from "@/hooks/user";
import { Card, Col, Descriptions, Row, Space, Tag } from "antd";
import { useSession } from "next-auth/react";

export const ProfileContainer = () => {
  const { user } = useUser();

  return (
    <AppLayout>
      <Row justify="center">
        <Col xl={12} lg={14} md={16} sm={18} xs={22}>
          <Card>
            <Descriptions title={user?.name} column={1} bordered size="small">
              <Descriptions.Item label="Policies">
                <Space>
                  {user?.policies.map((p) => (
                    <Tag>{p.policy.name}</Tag>
                  ))}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Accounts">
                <Space direction="vertical">
                  {user?.accounts.map((a) => (
                    <Tag>
                      {a.authProvider} | {a.name}
                    </Tag>
                  ))}
                </Space>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </AppLayout>
  );
};
