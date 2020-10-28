import { Message, TextChannel } from "discord.js";

/**
 * A shortcut is a function that returns a specific bit of data from a message
 */
export type Shortcut = (message: Message) => string;

/**
 * Shortcut that returns the username#discriminator of the author of the message
 * @param message
 */
export const author: Shortcut = (message) => message.author.tag;

/**
 * Shortcut that returns the current channel name
 * @param message
 */
export const channelName: Shortcut = (message) =>
  (message.channel as TextChannel).name;
