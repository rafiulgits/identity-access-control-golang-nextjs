import { NextPage } from "next";
import { useSession } from "next-auth/react";

const Page: NextPage = () => {
  const { status, data } = useSession();
  return (
    <div>
      <h1>Hello World</h1>
      {JSON.stringify(data)}
    </div>
  );
};

export default Page;
