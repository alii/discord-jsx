import { useClientContext } from "./context";
import { Message } from "discord.js";
import { useEffect } from "react";

export function useArguments() {
  const context = useClientContext();

  return function parseArguments(message: Message) {
    const [command, ...args] = message.content
      .replace(context.prefix, "")
      .split(" ");

    return { command, args };
  };
}

export function useCommand(callback: (message: Message) => unknown) {
  const { client } = useClientContext();

  useEffect(() => {
    client.on("message", callback);
    return () => void client.off("message", callback);
  }, []);
}
