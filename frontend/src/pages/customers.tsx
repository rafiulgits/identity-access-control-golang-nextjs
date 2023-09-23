import { AppLayout } from "@/components/Layout";
import { CustomersContainer } from "@/modules/customers/Container";
import { withProtected } from "@/navigation/Protector";
import { NextPage } from "next";

const Page: NextPage = () => {
  return (
    <AppLayout>
      <CustomersContainer />
    </AppLayout>
  );
};

export default withProtected(Page);
