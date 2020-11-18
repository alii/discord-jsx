import { Message, Permissions } from "discord.js";

/**
 * A function that will halt execution if an error is thrown
 */
export type Inhibitor = (message: Message) => void | never;

/**
 * Make this command executable by humans only
 * @param message
 */
export const noBots: Inhibitor = (message) => {
  if (message.author.bot) {
    throw new Error("This command cannot be used by bots");
  }
};

/**
 * Make this command run in a guild only
 * @param message
 */
export const guildsOnly: Inhibitor = (message) => {
  if (!message.guild) {
    throw new Error("This command can only be used in a server");
  }
};

/**
 * Make this command executable by guild admins only
 * @param message
 */
export const guildAdminsOnly: Inhibitor = (message) => {
  if (!message.guild) {
    throw new Error("This command can only be used in a server");
  }

  if (!message.member) {
    throw new Error("Could not find member of message");
  }

  if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
    throw new Error("You do not have permission to use this command");
  }
};

export const CommonInhibitors = {
  noBots,
  guildsOnly,
  guildAdminsOnly,
} as const;
