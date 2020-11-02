import * as React from "react";

import {
  Client,
  Command,
  Token,
  start,
  CommonInhibitors,
  author,
  channelName,
} from "../src";

import { TextChannel } from "discord.js";

function App() {
  return (
    <Client
      prefix={"--"}
      onError={(message, error) => {
        console.log(
          `[ERROR][c:${message.channel.id}, m:${message.id}]: ${error.message}`
        );
      }}
    >
      <Command
        name={"ping"}
        description={"Ping pong command"}
        inhibitors={[CommonInhibitors.guildsOnly]}
      >
        hello {(msg) => msg.author.tag}
      </Command>
      <Command
        name={"say"}
        description={"Repeats the message you say"}
        inhibitors={[CommonInhibitors.noBots, CommonInhibitors.guildsOnly]}
      >
        {(_msg, ...args) => args.join(" ")}
        {(message) => (message.channel as TextChannel).name}
      </Command>
      <Command
        name={"demo"}
        description={"Demos inline commands"}
        handler={(msg) => msg.reply("Hello world")}
      />
      <Command name={"shortcuts"} description={"Demos using shortcuts"}>
        Hello {{ author }}, I hope you like this {{ channelName }}
      </Command>
      <Token
        token={process.env.DISCORD_TOKEN!}
        onLogin={(client) => console.log(`Logging in as ${client.user?.tag}`)}
        onReady={(client) => console.log(`Ready as ${client.user?.tag}`)}
      />
    </Client>
  );
}

start(<App />);
