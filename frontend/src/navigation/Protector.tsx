import { AppLoading } from "@/components/AppLoading";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Redirect } from "./Redirect";
import { MemoryManager } from "@/util/memory-manager";
import { Keys } from "@/util/keys";

const LOADING_SCREEN = 1;
const PAGE_SCREEN = 2;
const REDIRECT = 3;

export const withProtected = (Component: React.FC) => {
  return function WithProtected(props: any) {
    const { status, data } = useSession();
    const router = useRouter();

    const [screen, setScreen] = useState(LOADING_SCREEN);

    const getFilteredNextPath = () => {
      if (
        !(
          router.asPath === "/auth/auth/login" ||
          router.asPath === "/auth/logout"
        )
      ) {
        return `?next=${router.asPath}`;
      }
      return "";
    };

    useEffect(() => {
      if (status === "unauthenticated") {
        setScreen(REDIRECT);
      }
      if (status === "authenticated") {
        MemoryManager.setItem(Keys.BearerToken, (data as any).accessToken);
        setScreen(PAGE_SCREEN);
      }
    }, [status]);

    if (screen === LOADING_SCREEN) {
      return <AppLoading />;
    }
    if (screen === PAGE_SCREEN) {
      return <Component {...props} />;
    }

    return <Redirect to={`/auth/login${getFilteredNextPath()}`} />;
  };
};

export const withAnonymous = (Component: React.FC) => {
  return function WithAnonymous(props: any) {
    const { status } = useSession();

    const router = useRouter();
    const { next } = router.query;

    const getRedirectPath = () => {
      if (next) {
        return `${next}`;
      }
      return "/profile";
    };

    const [screen, setScreen] = useState(LOADING_SCREEN);

    useEffect(() => {
      if (status === "authenticated") {
        setScreen(REDIRECT);
      } else {
        setScreen(PAGE_SCREEN);
      }
    }, [status]);

    if (screen === LOADING_SCREEN) {
      return <AppLoading />;
    }
    if (screen === PAGE_SCREEN) {
      return <Component {...props} />;
    }

    return <Redirect to={getRedirectPath()} />;
  };
};
