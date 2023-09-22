import { NextPage } from "next";
import { useSession } from "next-auth/react";

const Page: NextPage = () => {
  const session = useSession();
  return <div>{JSON.stringify(session)}</div>;
};

export default Page;
