import * as React from "react";
import { Navigator, useNavigateTo } from "../navigation";
import { Layout, Menu, Typography } from "antd";
import { useState } from "react";
import { createGlobalState } from "react-hooks-global-state";
import { HomeOutlined, UploadOutlined } from "@ant-design/icons";
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
import { reSyncDBs } from "../database/database";

const isProd = !require("electron-is-dev");

console.log("Is production: ", isProd);
export const firebaseApp = firebase.initializeApp(
  false
    ? {
        apiKey: "AIzaSyCBSE-x0NmHG2C4roY16qhqzFzKiDPSd3w",
        authDomain: "platter-app-8a7ce.firebaseapp.com",
        databaseURL: "https://platter-app-8a7ce.firebaseio.com",
        projectId: "platter-app-8a7ce",
        storageBucket: "platter-app-8a7ce.appspot.com",
        messagingSenderId: "621907320578",
        appId: "1:621907320578:web:8af41bba8c3be5dfd66c1b",
        measurementId: "G-E1HFYBNCXG",
      }
    : {
        apiKey: "AIzaSyA0wODCIgLPMUQSi-ot5G5ldA6MHF611cE",
        authDomain: "platter-app-dev.firebaseapp.com",
        databaseURL: "https://platter-app-dev.firebaseio.com",
        projectId: "platter-app-dev",
        storageBucket: "platter-app-dev.appspot.com",
        messagingSenderId: "279231398902",
        appId: "1:279231398902:web:c741a46c4fcbd149d03dd7",
        measurementId: "G-MBB79YN5YH",
      }
);

const onStart = () => {
  console.log("started");
  reSyncDBs();
};

export const App = () => {
  const [userToken, setUserToken] = useGlobalState("token");
  const [siderCollapsed, setSiderCollapsed] = useState(true);
  const navigateTo = useNavigateTo();
  const { Sider, Content } = Layout;

  React.useEffect(() => {
    onStart();
  }, []);

  // todo extract all this out, store token with keytar NOT global hook
  const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = userToken;
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? token : "no-token",
      },
    };
  });
  console.log("api: ", config.apiUrl);
  const httpLink = createHttpLink({
    uri: config.apiUrl,
  });

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    // @ts-ignore
    link: authLink.concat(httpLink),
    headers: {
      authorization: userToken || "no-token",
    },
    body: {},
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
          <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
            <Menu.Item
              onClick={() => {
                navigateTo("home");
              }}
              key="1"
            >
              <HomeOutlined />
              <span className="nav-text">Home</span>
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                console.log("navigating to upload");
                navigateTo("upload");
              }}
              key="2"
            >
              <UploadOutlined />
              <span className="nav-text">Upload</span>
            </Menu.Item>
          </Menu>
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
