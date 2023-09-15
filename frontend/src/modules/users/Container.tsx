import { ActionPanel } from "@/components/ActionPanel";
import { AppLayout } from "@/components/Layout";
import { UserCreateAction } from "./actions/UserCreate";
import { usePolicies } from "@/store/data/policy";
import { useEffect } from "react";
import { useUsers } from "@/store/data/user";
import { SearchControl } from "@/components/SearchControl";
import { Space, Table } from "antd";
import { AccountDto, UserDto, UserPolicyDto } from "@/models/user";
import { TableActionContainer } from "@/components/TableActionContainer";
import { UserProfileView } from "./views/Profile";

export const UsersContainer = () => {
  const { fetch: fetchPolicies } = usePolicies();
  const { fetch: fetchUsers, state } = useUsers();

  useEffect(() => {
    Promise.all([fetchPolicies(), fetchUsers()]);
  }, []);

  return (
    <AppLayout>
      <ActionPanel
        title="Users"
        rightActions={[<UserCreateAction key={1} />]}
        leftActions={[
          <SearchControl placeholder="Search User" onSearch={(val) => {}} />,
        ]}
      />
      <div style={{ marginTop: "1rem" }}>
        <Table
          size="small"
          loading={state.status === "loading"}
          dataSource={state.entities}
          columns={[
            { title: "ID", dataIndex: "id", key: "id" },
            { title: "Name", dataIndex: "name", key: "name" },
            {
              title: "policies",
              dataIndex: "policies",
              render: (policies: UserPolicyDto[]) => (
                <Space direction="horizontal">
                  {policies.map((a, i) => (
                    <span>{a.policy.name}</span>
                  ))}
                </Space>
              ),
            },
            {
              title: "Accounts",
              dataIndex: "accounts",
              render: (accounts: AccountDto[]) => (
                <Space direction="vertical">
                  {accounts.map((a, i) => (
                    <Space size={2} key={i} direction="horizontal">
                      <span>{a.authProvider}</span>
                      <span>{":"}</span>
                      <span>{a.name}</span>
                    </Space>
                  ))}
                </Space>
              ),
            },
            {
              title: "Action",
              dataIndex: "action",
              render: (_: any, row: UserDto) => (
                <TableActionContainer key={row.id}>
                  <UserProfileView user={row} />
                </TableActionContainer>
              ),
            },
          ]}
        />
      </div>
    </AppLayout>
  );
};
