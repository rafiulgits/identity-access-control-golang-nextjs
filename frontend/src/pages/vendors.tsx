import { AppLayout } from "@/components/Layout";
import { VendorsContainer } from "@/modules/vendors/Container";
import { NextPage } from "next";

const Page: NextPage = () => {
  return (
    <AppLayout>
      <VendorsContainer />
    </AppLayout>
  );
};

export default Page;
