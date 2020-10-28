import { Message } from "discord.js";

/**
 * A function that will halt execution if an error is thrown
 */
export type Inhibitor = (message: Message) => void | never;

export const CommonInhibitors: Record<"guildsOnly" | "noBots", Inhibitor> = {
  noBots: (message: Message) => {
    if (message.author.bot) {
      throw new Error("This command cannot be used by bots");
    }
  },
  guildsOnly: (message: Message) => {
    if (!message.guild) {
      throw new Error("This command can only be used in a server");
    }
  },
} as const;
