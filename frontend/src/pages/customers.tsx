import { AppLayout } from "@/components/Layout";
import { CustomersContainer } from "@/modules/customers/Container";
import { NextPage } from "next";

const Page: NextPage = () => {
  return (
    <AppLayout>
      <CustomersContainer />
    </AppLayout>
  );
};

export default Page;
