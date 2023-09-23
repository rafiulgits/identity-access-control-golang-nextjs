import { AppLayout } from "@/components/Layout";
import { ProductsContainer } from "@/modules/products/Container";
import { withProtected } from "@/navigation/Protector";
import { NextPage } from "next";

const Page: NextPage = () => {
  return (
    <AppLayout>
      <ProductsContainer />
    </AppLayout>
  );
};

export default withProtected(Page);
