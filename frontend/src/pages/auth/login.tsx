import { LoginContainer } from "@/modules/login/Container";
import { withAnonymous } from "@/navigation/Protector";
import { NextPage } from "next";

const Page: NextPage = () => {
  return <LoginContainer />;
};

export default withAnonymous(Page);
