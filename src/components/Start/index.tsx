import * as React from "react";
import styled from "styled-components";
import { Card, Modal } from "antd";

import { Login } from "./Login";
import { useNavigateTo } from "../../navigation";
import { useState } from "react";

const AbsoluteFull = styled(Card)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  justify-content: center;
  align-items: center;
`;

const Start = () => {
  const [modalVisible, setModalVisible] = useState(true);
  const navigateTo = useNavigateTo();
  return (
    <FullScreen>
      <Modal
        title={null}
        footer={null}
        visible={modalVisible}
        centered
        width={350}
        closable={false}
        afterClose={() => {}}
      >
        <Login
          onComplete={() => {
            navigateTo("home");
            setModalVisible(false);
          }}
        />
      </Modal>
    </FullScreen>
  );
};

export default Start;
export const FullScreen = (props: { children: JSX.Element }) => {
  return <AbsoluteFull>{props.children}</AbsoluteFull>;
};
