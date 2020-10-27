import { useClientContext } from "./context";
import { Message } from "discord.js";
import { useArguments } from "./util";

type CommandProps = {
  name: string;
  description: string;
  handler(message: Message, ...args: string[]): unknown;
};

export function Command(props: CommandProps) {
  const context = useClientContext();
  const parseArguments = useArguments();

  context.client.on("message", async (message) => {
    const { command: commandName, args } = parseArguments(message);

    if (commandName === props.name) {
      await props.handler(message, ...args);
    }
  });

  return null;
}
