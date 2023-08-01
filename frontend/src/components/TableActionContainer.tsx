import { Divider, Space } from "antd";

export const TableActionContainer = (props: any) => (
  <Space
    size={2}
    split={<Divider type="vertical" style={{ margin: "0", padding: "0" }} />}
  >
    <>{props.children}</>
  </Space>
);
