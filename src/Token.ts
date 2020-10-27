import { useClientContext } from "./context";
import { useEffect } from "react";
import { Client } from "discord.js";

type TokenProps = {
  token: string;
  onReady(client: Client): void;
  onLogin?(client: Client): void;
};

export function Token(props: TokenProps) {
  const context = useClientContext();

  useEffect(() => {
    context.client.login(props.token).then(() => {
      if (props.onLogin) {
        props.onLogin(context.client);
      }
    });

    context.client.on("ready", () => props.onReady(context.client));
  }, []);

  return null;
}
