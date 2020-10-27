import { useClientContext } from "./context";
import { useEffect } from "react";

type TokenProps = {
  token: string;
  onReady(): void;
  onLogin?(): void;
};

export function Token(props: TokenProps) {
  const context = useClientContext();

  useEffect(() => {
    context.client.login(props.token).then(() => {
      if (props.onLogin) {
        props.onLogin();
      }
    });

    context.client.on("ready", props.onReady);
  }, []);

  return null;
}
