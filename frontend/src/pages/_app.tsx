import "antd/dist/reset.css";
import "@/styles/globals.css";

import type { AppProps } from "next/app";
import { ConfigProvider } from "antd";
import { Provider as StoreProvider } from "react-redux";
import { SessionProvider } from "next-auth/react";
import store from "@/store";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider
      refetchWhenOffline={false}
      session={session}
      refetchInterval={300} // 5 min
      refetchOnWindowFocus={false}
    >
      <StoreProvider store={store}>
        <ConfigProvider
          theme={{
            token: {
              fontSize: 12,
              colorPrimary: "#1B1212",
              colorPrimaryBg: "#adb5bd",
              colorPrimaryHover: "#023020",
              colorPrimaryBgHover: "#023020",
              colorPrimaryActive: "#023020",
              colorBgLayout: "#e9ecef",
              colorBgBase: "#f8f9fa",
              colorBgContainer: "#f8f9fa",
            },
          }}
        >
          <Component {...pageProps} />
        </ConfigProvider>
      </StoreProvider>
    </SessionProvider>
  );
}
