import { ActionPanel } from "@/components/ActionPanel";
import { TableActionContainer } from "@/components/TableActionContainer";
import { CustomerDto } from "@/models/customer";
import { useCustomers } from "@/store/data/customer";
import { Table } from "antd";
import { useEffect, useMemo, useState } from "react";
import { CustomerCreateAction } from "./actions/Create";
import { CustomerDeleteAction } from "./actions/Delete";
import { CustomerUpdateAction } from "./actions/Update";
import { SearchControl } from "@/components/SearchControl";

export const CustomersContainer = () => {
  const { state, fetch } = useCustomers();
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch();
  }, []);

  const filteredEntities = useMemo(() => {
    if (!search) {
      return state.entities;
    }
    let _search = search.toLowerCase();
    return state.entities.filter(
      (item) =>
        item.code.toLowerCase().includes(_search) ||
        item.name.toLowerCase().includes(_search) ||
        item.phone.toLowerCase().includes(_search) ||
        item.address.toLowerCase().includes(_search)
    );
  }, [state.entities, search]);

  return (
    <section>
      <ActionPanel
        title="Customers"
        rightActions={[<CustomerCreateAction key={1} />]}
        leftActions={[
          <SearchControl
            key={1}
            placeholder="Search customers"
            onSearch={setSearch}
          />,
        ]}
      />
      <div style={{ marginTop: "1rem" }}>
        <Table
          size="small"
          loading={state.status === "loading"}
          dataSource={filteredEntities}
          columns={[
            { title: "ID", dataIndex: "id", key: "id" },
            { title: "Name", dataIndex: "name", key: "name" },
            { title: "Code", dataIndex: "code", key: "code" },
            { title: "Phone", dataIndex: "phone", key: "phone" },
            { title: "Address", dataIndex: "address", key: "address" },
            {
              title: "Action",
              dataIndex: "action",
              render: (_: any, row: CustomerDto) => (
                <TableActionContainer key={row.id}>
                  <CustomerUpdateAction customer={row} />
                  <CustomerDeleteAction customerId={row.id} />
                </TableActionContainer>
              ),
            },
          ]}
        />
      </div>
    </section>
  );
};
