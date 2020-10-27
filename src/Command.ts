import { useClientContext } from "./context";
import { APIMessageContentResolvable, Message } from "discord.js";
import { useArguments } from "./util";
import { Inhibitor } from "./CommonInhibitors";

type Child =
  | string
  | number
  | ((message: Message, ...args: string[]) => string);

type CommandProps = {
  name: string;
  description: string;
  inhibitors?: Inhibitor[];
} & (
  | { children: Child | Child[] }
  | { handler(message: Message, ...args: string[]): unknown }
);

export function Command(props: CommandProps) {
  const context = useClientContext();
  const parseArguments = useArguments();

  context.client.on("message", async (message) => {
    const { command: commandName, args } = parseArguments(message);

    if (commandName !== props.name) {
      return;
    }

    if (message.author.id === context.client.user.id) return;

    if (props.inhibitors) {
      for (const inhibitor of props.inhibitors) {
        try {
          await inhibitor(message);
        } catch (e) {
          return message.channel.send(
            `⚠️ **Command was inhibited**: ${e.message}`
          );
        }
      }
    }

    if ("children" in props) {
      const children: Child[] = Array.isArray(props.children)
        ? props.children
        : [props.children];

      const returnMessage: APIMessageContentResolvable = children
        .reduce((msg, child) => {
          if (typeof child === "function") {
            return msg + child(message, ...args);
          }

          return msg + child.toString();
        }, "")
        .toString();

      await message.channel.send(returnMessage);
    } else {
      await props.handler(message, ...args);
    }
  });

  return null;
}
