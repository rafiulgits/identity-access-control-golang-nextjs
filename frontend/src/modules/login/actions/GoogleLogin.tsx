import { GoogleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";

export const GoogleLoginAction = () => {
  const router = useRouter();

  const { error, callbackUrl } = router.query;
  const { status } = useSession();

  const getLoginSuccessRedirectUrl = () => {
    if (callbackUrl && typeof callbackUrl === "string") {
      return callbackUrl;
    }
    return "/profile";
  };

  const handleLogin = async () => {
    await signIn("google", {
      callbackUrl: getLoginSuccessRedirectUrl(),
      redirect: false,
    });
  };

  return (
    <Button
      loading={status === "loading"}
      type="primary"
      disabled={status === "authenticated"}
      icon={<GoogleOutlined />}
      onClick={handleLogin}
    >
      Login with Google
    </Button>
  );
};
