# `discord-jsx`

### Installation

```shell script
yarn add discord-jsx
```

### Usage

```tsx
import { Client, Command, Event, Token, start } from "discord-jsx";

const token = process.env.DISCORD_TOKEN;

function App() {
  return (
    <Client prefix={"!"}>
      <Command
        name={"ping"}
        description={"Basic ping-pong command"}
        handler={(message) => message.reply("Pong")}
      />
      <Event
        event={"message"}
        handler={(message) => {
          console.log(`[${message.author.tag}]: ${message.content}`);
        }}
      />
      <Token
        onReady={() => console.log("Ready")}
        onLogin={() => console.log("Logging in")}
        token={token}
      />
    </Client>
  );
}

start(<App />);
```

##### This project is very experimental, don't use it in production... please.....
