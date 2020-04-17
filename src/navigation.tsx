import * as React from "react";
import { Home } from "./Home";
import { useGlobalState } from "./renderer/App";
import { Page } from "./components/Page";
import { Init } from "./components/Init";

type Location = "home" | "upload" | "signup" | "init";
const defaultLocation = "init";

let location: Location = defaultLocation;

const screens: Record<Location, JSX.Element> = {
  home: <Home />,
  upload: (
    <Page>
      <div
        style={{
          width: "100%",
          height: "100%",
          flex: 1,
          backgroundColor: "red",
        }}
      >
        hi
      </div>
    </Page>
  ),
  signup: <p>signup</p>,
  init: <Init />,
};

export const Navigator = () => {
  const [gLocation] = useGlobalState("location");

  // @ts-ignore
  return screens[gLocation];
};

export const useNavigateTo = () => {
  const [gLocation, setGLocation] = useGlobalState("location");
  console.log("at ", gLocation);
  return (destination: Location) => {
    location = destination;
    setGLocation(destination);
  };
};

export const Link = (props: {
  destination: Location;
  children: JSX.Element;
}) => {
  const navigateTo = useNavigateTo();

  return (
    <div onClick={() => navigateTo(props.destination)}>{props.children}</div>
  );
};

export const useGetLocation = () => {};
