import Icon from "@ant-design/icons";
import { Button } from "antd";
import { useSession, signIn } from "next-auth/react";

const MicrosoftSvg = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    width="1rem"
    height="1rem"
  >
    <path fill="#ff5722" d="M6 6H22V22H6z" transform="rotate(-180 14 14)" />
    <path fill="#4caf50" d="M26 6H42V22H26z" transform="rotate(-180 34 14)" />
    <path fill="#ffc107" d="M26 26H42V42H26z" transform="rotate(-180 34 34)" />
    <path fill="#03a9f4" d="M6 26H22V42H6z" transform="rotate(-180 14 34)" />
  </svg>
);
export const MicrosoftLoginAction = () => {
  const { status } = useSession();

  return (
    <Button
      loading={status === "loading"}
      type="primary"
      icon={<Icon component={MicrosoftSvg} />}
      onClick={() => {
        signIn("azure-ad");
      }}
    >
      Login with Microsoft
    </Button>
  );
};
