import * as React from "react";
import { Client, Command, Token, start, CommonInhibitors } from "../src";

function App() {
  return (
    <Client prefix={"--"}>
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
      </Command>
      <Command
        name={"demo"}
        description={"Demos inline commands"}
        handler={(msg) => msg.reply("Hello world")}
      />
      <Token
        token={process.env.DISCORD_TOKEN!}
        onLogin={(client) => console.log(`Logging in as ${client.user.tag}`)}
        onReady={(client) => console.log(`Ready as ${client.user.tag}`)}
      />
    </Client>
  );
}

start(<App />);
