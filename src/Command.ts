import { useClientContext } from "./context";
import { Message } from "discord.js";
import { useArguments, useCommand } from "./util";
import { Inhibitor } from "./CommonInhibitors";
import { Shortcut } from "./Shortcuts";

type Child =
  | string
  | number
  | ((message: Message, ...args: string[]) => string | Promise<string>)
  | Record<string, Shortcut>;

type CommandProps = {
  name: string;
  description: string;
  inhibitors?: Inhibitor[];
} & (
  | { children: Child | Child[] }
  | { handler(message: Message, ...args: string[]): unknown }
);

export function Command(props: CommandProps): JSX.Element {
  const parseArguments = useArguments();
  const context = useClientContext();

  useCommand(async (message) => {
    const { command: commandName, args } = parseArguments(message);

    if (commandName !== props.name) {
      return;
    }

    if (message.author.id === context.client.user?.id) return;

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
      try {
        const children: Child[] = Array.isArray(props.children)
          ? props.children
          : [props.children];

        const returnMessage = await children.reduce(async (_msg, child) => {
          const msg = await _msg;

          if (typeof child === "function") {
            return msg + (await child(message, ...args));
          }

          if (typeof child === "object") {
            const values = Object.values(child);

            if (values.length !== 1) {
              throw new Error(
                `Shortcut objects must only have one property. Found ${values.length} on ${child}`
              );
            }

            const [shortcut] = values;

            return msg + shortcut(message);
          }

          return msg + child.toString();
        }, Promise.resolve(""));

        await message.channel.send(returnMessage);
      } catch (e) {
        if ("onError" in context) {
          return context.onError(message, e);
        } else {
          message.channel.send(`⚠ **An error occurred:** ${e.message}`);
          context.allowLogging && console.error(e);
        }
      }
    } else {
      await props.handler(message, ...args);
    }
  });

  return null;
}
