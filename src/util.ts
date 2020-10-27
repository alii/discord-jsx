import { useClientContext } from "./context";
import { Message } from "discord.js";

export function useArguments() {
  const context = useClientContext();

  return function parseArguments(message: Message) {
    const [command, ...args] = message.content
      .replace(context.prefix, "")
      .split(" ");

    return { command, args };
  };
}
