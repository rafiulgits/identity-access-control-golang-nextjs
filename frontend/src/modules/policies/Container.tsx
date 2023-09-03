import { AppLayout } from "@/components/Layout";
import { PolicyCreateAction } from "./actions/PolicyCreate";
import { usePolicies } from "@/store/data/policy";
import { useEffect } from "react";
import { ActionPanel } from "@/components/ActionPanel";
import { Descriptions, Space, Table, Tag } from "antd";
import { PermissionDto, PolicyDto } from "@/models/policy";
import { TableActionContainer } from "@/components/TableActionContainer";
import { permissions } from "@/util/values";
import { SearchControl } from "@/components/SearchControl";

export const PoliciesContainer = () => {
  const { fetch, state } = usePolicies();

  useEffect(() => {
    fetch();
  }, []);

  return (
    <AppLayout>
      <ActionPanel
        title="Policies"
        leftActions={[
          <SearchControl placeholder="Search Policy" onSearch={() => {}} />,
        ]}
        rightActions={[<PolicyCreateAction key={1} />]}
      />
      <div style={{ marginTop: "1rem" }}>
        <Table
          size="small"
          loading={state.status === "loading"}
          dataSource={state.entities}
          columns={[
            { title: "Name", dataIndex: "name", key: "name", width: "25%" },
            {
              title: "Permissions",
              dataIndex: "permissions",
              render: (perms: PermissionDto[]) => {
                return (
                  <Descriptions column={1}>
                    {perms.map((perm, idx) => (
                      <Descriptions.Item
                        style={{ padding: 0 }}
                        key={idx + 1}
                        label={<b>{perm.module}</b>}
                      >
                        <Space direction="horizontal">
                          {perm.access
                            .toString()
                            .split("")
                            .flatMap((a, i) => {
                              if (a === "0") {
                                return [];
                              }
                              return (
                                <Tag
                                  style={{ margin: 0 }}
                                  color="green-inverse"
                                >
                                  {permissions[i]}
                                </Tag>
                              );
                            })}
                        </Space>
                      </Descriptions.Item>
                    ))}
                  </Descriptions>
                );
              },
            },
            {
              title: "Action",
              width: "25%",
              dataIndex: "action",
              render: (_: any, row: PolicyDto) => (
                <TableActionContainer key={row.id}></TableActionContainer>
              ),
            },
          ]}
        />
      </div>
    </AppLayout>
  );
};
