import { ClientEvents } from "discord.js";
import { useClientContext } from "./context";

type EventProps<Key extends keyof ClientEvents> = {
  event: Key;
  handler(...args: ClientEvents[Key]): void;
};

export function Event<Key extends keyof ClientEvents>(props: EventProps<Key>) {
  const context = useClientContext();
  context.client.on(props.event, (...args) => props.handler(...args));
  return null;
}
