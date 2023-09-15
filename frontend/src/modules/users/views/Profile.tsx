import { useToggle } from "@/hooks";
import { AccountDto, UserDto } from "@/models/user";
import { EyeFilled } from "@ant-design/icons";
import { Button, Card, Col, Drawer, Row, Table } from "antd";
import { UserUpdateAction } from "../actions/UserUpdate";
import { TableActionContainer } from "@/components/TableActionContainer";
import { AccountUpdateAction } from "../actions/AccountUpdate";
import { AccountDeleteAction } from "../actions/AccountDelete";
import { AccountCreateAction } from "../actions/AccountCreate";

interface Props {
  user: UserDto;
}

export const UserProfileView = (props: Props) => {
  const { toggle, visible } = useToggle();
  const { user } = props;

  return (
    <>
      <Button type="text" onClick={toggle} icon={<EyeFilled />} />
      <Drawer
        bodyStyle={{ backgroundColor: "#F2F4F8" }}
        title={user.name}
        open={visible}
        onClose={toggle}
        width={"100%"}
      >
        <Row justify="center">
          <Col lg={20} md={21} sm={22} xs={23}>
            <UserUpdateAction user={user} />
            <br />
            <Card title="Accounts" extra={<AccountCreateAction user={user} />}>
              <Table
                rowKey="id"
                size="small"
                pagination={false}
                columns={[
                  {
                    title: "Provider",
                    dataIndex: "authProvider",
                  },
                  {
                    title: "Name/ID",
                    dataIndex: "name",
                  },
                  {
                    title: "Actions",
                    dataIndex: "actions",
                    render: (_: any, row: AccountDto) => {
                      return (
                        <TableActionContainer key={row.id}>
                          <AccountUpdateAction account={row} />
                          <AccountDeleteAction account={row} />
                        </TableActionContainer>
                      );
                    },
                  },
                ]}
                dataSource={props.user.accounts}
              />
            </Card>
          </Col>
        </Row>
      </Drawer>
    </>
  );
};
