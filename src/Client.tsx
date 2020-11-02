import { Client as DiscordClient, ClientOptions } from "discord.js";
import { Provider, ClientContext } from "./context";
import * as React from "react";

type ClientProps = {
  children: React.ReactNode;
  prefix: string;
  constructorOptions?: ClientOptions;
  onError?: ClientContext["onError"];
  allowLogging?: boolean;
};

export function Client(props: ClientProps): JSX.Element {
  return (
    <Provider
      value={{
        client: new DiscordClient(props.constructorOptions),
        prefix: props.prefix,
        onError: props.onError,
        // Default to on
        allowLogging: props.allowLogging ?? true,
      }}
    >
      {props.children}
    </Provider>
  );
}
