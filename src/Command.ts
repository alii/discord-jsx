import { useClientContext } from "./context";
import { Message } from "discord.js";

type CommandProps = {
  name: string;
  description: string;
  handler(message: Message): unknown;
};

export function Command(props: CommandProps) {
  const context = useClientContext();

  context.client.on("message", async (message) => {
    if (message.content.startsWith(context.prefix)) {
      await props.handler(message);
    }
  });

  return null;
}
