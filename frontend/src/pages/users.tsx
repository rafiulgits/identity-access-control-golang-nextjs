import { UsersContainer } from "@/modules/users/Container";
import { withProtected } from "@/navigation/Protector";
import { NextPage } from "next";

const Page: NextPage = () => {
  return <UsersContainer />;
};

export default withProtected(Page);
