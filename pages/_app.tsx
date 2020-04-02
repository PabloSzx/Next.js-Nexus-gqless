import { NextPage } from "next";
import { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const SuspenseWrapper = dynamic(
  async () => ({ children }) => {
    return <Suspense fallback={null}>{children}</Suspense>;
  },
  { ssr: false }
);

const App: NextPage<AppProps> = ({ Component, pageProps }) => {
  return (
    <SuspenseWrapper>
      <Component {...pageProps} />
    </SuspenseWrapper>
  );
};

export default App;
