import { ProfileContainer } from "@/modules/profile/Container";
import { withProtected } from "@/navigation/Protector";
import { NextPage } from "next";

const Page: NextPage = () => {
  return <ProfileContainer />;
};

export default withProtected(Page);
