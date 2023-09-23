import { PoliciesContainer } from "@/modules/policies/Container";
import { withProtected } from "@/navigation/Protector";
import { NextPage } from "next";

const Page: NextPage = () => {
  return <PoliciesContainer />;
};

export default withProtected(Page);
