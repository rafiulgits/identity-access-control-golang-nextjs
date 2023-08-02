import { AppLayout } from "@/components/Layout";
import { ProductsContainer } from "@/modules/products/Container";
import { NextPage } from "next";

const Page: NextPage = () => {
  return (
    <AppLayout>
      <ProductsContainer />
    </AppLayout>
  );
};

export default Page;
