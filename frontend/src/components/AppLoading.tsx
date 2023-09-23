import { LoadingOutlined } from "@ant-design/icons";
import { Result } from "antd";

interface Props {
  title?: string;
}
export const AppLoading = (props: Props) => (
  <Result
    icon={<LoadingOutlined />}
    title={props.title ? props.title : "Loading"}
    style={{ marginTop: "3rem" }}
  />
);
