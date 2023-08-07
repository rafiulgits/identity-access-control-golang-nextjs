import { AppLayout } from "@/components/Layout";
import { Button, Space } from "antd";
import { NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";

const Page: NextPage = () => {
  const { data, status } = useSession();
  return (
    <AppLayout>
      <Space>
        <Button
          loading={status === "loading"}
          disabled={status === "authenticated"}
          onClick={() => {
            signIn("google");
          }}
        >
          Login with Google
        </Button>
        <Button
          loading={status === "loading"}
          disabled={status === "unauthenticated"}
          onClick={() => {
            signOut();
          }}
        >
          Logout
        </Button>
      </Space>
      <br />
      <p>{JSON.stringify(data)}</p>
    </AppLayout>
  );
};

export default Page;
