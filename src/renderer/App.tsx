import "antd/dist/antd.compact.css";
import firebase from "firebase";
import * as React from "react";
import { Navigator } from "../navigation";
import { Layout } from "antd";
import { useEffect, useState } from "react";
import { createGlobalState } from "react-hooks-global-state";
import { setContext } from "apollo-link-context";
import { createHttpLink } from "apollo-link-http";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { config } from "../config";
import { Sidebar } from "../components/Layout/Sidebar";
import { useKeytar } from "../helpers/keytar";
import { StatusBar, StatusBarheight } from "../components/StatusBar/StatusBar";
import { siderWidth } from "../theme";
import { useInitSettings } from "../helpers/settings";
import { TitleBar, TitleBarHeight } from "./TitleBar";

export const { useGlobalState } = createGlobalState({
  navDestination: "start",
  navProps: {},
});

const isProd = !require("electron-is-dev");

console.log("Is production: ", isProd);
export const firebaseApp = firebase.initializeApp(config.firebaseOptions);

const onStart = () => {
  console.log("started");
};

export const App = () => {
  const getContext = useGetContext();
  const { Sider, Content } = Layout;
  const initSettings = useInitSettings();
  const { setValue: setToken } = useKeytar("token");
  const [navs, setNavs] = useState(0);

  useEffect(() => {
    setToken(null);
    initSettings();
    onStart();
  }, []);

  const httpLink = createHttpLink({
    uri: config.apiUrl,
  });

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    // @ts-ignore
    link: getContext.concat(httpLink),
  });

  return (
    <ApolloProvider client={client}>
      <TitleBar />
      <Layout
        style={{
          position: "absolute",
          display: "flex",
          top: TitleBarHeight,
          bottom: StatusBarheight,
          right: 0,
          left: 0,
          userSelect: "none",
        }}
      >
        <Sider
          style={{
            overflow: "auto",
            height: "100%",
            position: "absolute",
          }}
          collapsed={true}
          collapsedWidth={siderWidth}
        >
          <Sidebar />
        </Sider>
        <Layout
          className="site-layout"
          style={{
            marginLeft: siderWidth,
            height: "100%",
          }}
        >
          <Content style={{ margin: "4px 4px 4px 4px", overflow: "initial" }}>
            <div
              className="site-layout-background"
              style={{ padding: 0, textAlign: "center" }}
            >
              <Navigator
                onNavigate={() => {
                  // This is just here to refresh this component on nav
                  setNavs(navs + 1);
                }}
              />
            </div>
          </Content>
        </Layout>
      </Layout>
      <StatusBar />
    </ApolloProvider>
  );
};

const useGetContext = () => {
  const { value: token, refresh } = useKeytar("token");

  const authLink = setContext((_, { headers }) => {
    refresh();
    return {
      headers: {
        ...headers,
        authorization: token,
      },
    };
  });
  return authLink;
};
