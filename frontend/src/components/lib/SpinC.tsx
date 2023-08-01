import { LoadingOutlined } from "@ant-design/icons";
import { Spin, SpinProps } from "antd";

interface Props extends SpinProps {}

const SpinC = (props: Props) => {
  const { children, ...restProps } = props;
  return (
    <Spin indicator={<LoadingOutlined />} {...restProps}>
      {children}
    </Spin>
  );
};

export default SpinC;
