import { LoadingOutlined } from "@ant-design/icons";
import { Result } from "antd";
import { signOut } from "next-auth/react";
import { useEffect } from "react";

const Page = () => {
  useEffect(() => {
    signOut();
  }, []);

  return <Result icon={<LoadingOutlined />} title={"Logging Out"} />;
};

export default Page;
