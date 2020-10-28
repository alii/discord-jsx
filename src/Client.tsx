import { Client as DiscordClient, ClientOptions } from "discord.js";
import { Provider } from "./context";
import * as React from "react";

type ClientProps = {
  children: React.ReactNode;
  prefix: string;
  constructorOptions?: ClientOptions;
};

export function Client(props: ClientProps): JSX.Element {
  return (
    <Provider
      value={{
        client: new DiscordClient(props.constructorOptions),
        prefix: props.prefix,
      }}
    >
      {props.children}
    </Provider>
  );
}
