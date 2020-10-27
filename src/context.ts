import { Client } from "discord.js";
import { createContext, useContext } from "react";

type ClientContext = {
  client: Client;
  prefix: string;
};

export const context = createContext<ClientContext | null>(null);

export const Provider = context.Provider;

export function useClientContext(): ClientContext {
  const clientContext = useContext(context);

  if (clientContext === null) {
    throw new Error("Client Provider not found.");
  }

  return clientContext;
}
