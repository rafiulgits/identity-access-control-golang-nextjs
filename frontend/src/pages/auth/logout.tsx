import { AppLoading } from "@/components/AppLoading";
import { withProtected } from "@/navigation/Protector";
import { MemoryManager } from "@/util/memory-manager";
import { signOut } from "next-auth/react";
import { useEffect } from "react";

const Page = () => {
  useEffect(() => {
    MemoryManager.clear();
    signOut();
  }, []);

  return <AppLoading title="Logging Out" />;
};

export default withProtected(Page);
