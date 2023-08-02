import { ActionPanel } from "@/components/ActionPanel";
import { TableActionContainer } from "@/components/TableActionContainer";
import { ProductDto } from "@/models/product";
import { useProducts } from "@/store/data/product";
import { Table } from "antd";
import { useEffect, useMemo, useState } from "react";
import { ProductCreateAction } from "./actions/Create";
import { ProductDeleteAction } from "./actions/Delete";
import { ProductUpdateAction } from "./actions/Update";
import { SearchControl } from "@/components/SearchControl";

export const ProductsContainer = () => {
  const { state, fetch } = useProducts();
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
        item.price.toString().includes(_search)
    );
  }, [state.entities, search]);

  return (
    <section>
      <ActionPanel
        title="Products"
        rightActions={[<ProductCreateAction key={1} />]}
        leftActions={[
          <SearchControl
            key={1}
            placeholder="Search products"
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
            { title: "Price", dataIndex: "price", key: "price" },
            {
              title: "Action",
              dataIndex: "action",
              render: (_: any, row: ProductDto) => (
                <TableActionContainer key={row.id}>
                  <ProductUpdateAction product={row} />
                  <ProductDeleteAction productId={row.id} />
                </TableActionContainer>
              ),
            },
          ]}
        />
      </div>
    </section>
  );
};
