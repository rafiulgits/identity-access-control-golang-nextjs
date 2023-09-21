import { GoogleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useSession, signIn } from "next-auth/react";

export const GoogleLoginAction = () => {
  const { status } = useSession();

  return (
    <Button
      loading={status === "loading"}
      type="primary"
      disabled={status === "authenticated"}
      icon={<GoogleOutlined />}
      onClick={() => {
        signIn("google");
      }}
    >
      Login with Google
    </Button>
  );
};
