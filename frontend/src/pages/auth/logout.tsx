import { AppLoading } from "@/components/AppLoading";
import { withProtected } from "@/navigation/Protector";
import { signOut } from "next-auth/react";
import { useEffect } from "react";

const Page = () => {
  useEffect(() => {
    signOut();
  }, []);

  return <AppLoading title="Logging Out" />;
};

export default withProtected(Page);
