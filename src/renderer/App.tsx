import * as React from "react";
import { Navigator } from "../navigation";
import { Layout } from "antd";
import { useState } from "react";
import { createGlobalState } from "react-hooks-global-state";
import { setContext } from "apollo-link-context";
import { createHttpLink } from "apollo-link-http";
export const { useGlobalState } = createGlobalState({
  location: "start",
  token: "token-not-set",
});
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { config } from "../config";
import firebase from "firebase";
import "antd/dist/antd.css";
import "ant-design-pro/dist/ant-design-pro.css";
import { Sidebar } from "../components/Layout/Sidebar";

const isProd = !require("electron-is-dev");

console.log("Is production: ", isProd);
export const firebaseApp = firebase.initializeApp(config.firebaseOptions);

const onStart = () => {
  console.log("started");
};

export const App = () => {
  const [siderCollapsed, setSiderCollapsed] = useState(true);
  const getContext = useGetContext();
  const { Sider, Content } = Layout;

  React.useEffect(() => {
    onStart();
  }, []);

  console.log("api: ", config.apiUrl);
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
      <Layout
        style={{
          userSelect: "none",
        }}
      >
        <Sider
          collapsible
          style={{
            overflow: "auto",
            height: "100%",
            position: "fixed",
            left: 0,
          }}
          collapsed={siderCollapsed}
          onCollapse={setSiderCollapsed}
        >
          <Sidebar />
        </Sider>
        <Layout
          className="site-layout"
          style={{
            marginLeft: siderCollapsed ? 80 : 200,

            height: "100%",
          }}
        >
          <Content style={{ margin: "4px 4px 4px 4px", overflow: "initial" }}>
            <div
              className="site-layout-background"
              style={{ padding: 0, textAlign: "center" }}
            >
              <Navigator />
            </div>
          </Content>
        </Layout>
      </Layout>
    </ApolloProvider>
  );
};

const useGetContext = () => {
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: "todo",
      },
    };
  });
  return authLink;
};
