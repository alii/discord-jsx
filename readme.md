# `discord-jsx`

### Installation

```
yarn add discord-jsx
```

### Usage

##### View the example in [examples](examples/index.tsx)

## API

## Components

### `<Client />`

| _prop_      | prefix                | onError?                    |
| ----------- | --------------------- | --------------------------- |
| _type_      | string                | `(error: Error) => unknown` |
| Description | The prefix of the bot | An error handler            |

This is the most fundamental part of any `discord-jsx` application. It is the internal `Provider` for the discord.js `Client` under the hood, as well as prefix among other things.

### `<Token token={string} />`

| _prop_      | token         | onReady                       | onLogin?                      |
| ----------- | ------------- | ----------------------------- | ----------------------------- |
| _type_      | string        | `(client: Client) => unknown` | `(client: Client) => unknown` |
| Description | The bot token | Ready event shorthand         | Login event shorthand         |

This component will run `client.login()` under the hood, and is the starting point for any `discord-jsx` client.

### `<Command />`

| _prop_      | name                    | description                               | inhibitors?                      | handler?                                           | children?                      |
| ----------- | ----------------------- | ----------------------------------------- | -------------------------------- | -------------------------------------------------- | ------------------------------ |
| _type_      | string                  | string                                    | `Inhibitor[]`                    | `(message: Message, ...args: string[]) => unknown` | Read below                     |
| Description | The name of the command | The description of what this command does | Optional inhibitors (Read below) | Optional handler function (Read below)             | Optional children (Read below) |

The `Command` component is very versatile when not using a `handler` function prop. It supports three main types of children. Text (string or number), a Shortcut (we'll come on to that later), or a custom function that takes 0-2 arguments.

For instance, we can pass regular text as a simple reply. E.g.

```tsx
<Command name={"example"} description={"This is an example command"}>
  This would be the example reply.
</Command>
```

However, we can do much more with Shortcuts. As the name implies, these are shorter ways to template a message. `discord-jsx` has a few built in. Currently, they are `author` and `channelName`. You can use shortcuts in a handlebars-style syntax. E.g.

```tsx
<Command
  name={"example"}
  description={"This is an example command using shortcuts"}
>
  Hello, {{ author }}. You sent a message in {{ channelName }}.
</Command>
```

Under the hood, these are actually valid JavaScript objects, and we just call the first property. A shortcut is simply a function that takes a `Message` as the first argument and always returns a string. Because of this, it's easy to build your own and reuse them as you please.

Secondly, `Command` also accepts a function that takes 0-2 argument. Similar to a `Shortcut` however this time, they can be async. This allows for database calls etc to be executed. E.g.

```tsx
// An example function
async function getFavouriteFood(discordId: string): Promise<string> {
  const user = await database.getUserByDiscord(discordId);
  return user.favouriteFood;
}

<Command
  name={"food"}
  description={"This is an example command using inline functions"}
>
  Hello {{ author }}. Your favourite food is{" "}
  {(msg) => getFavouriteFood(msg.author.id)}.
</Command>;
```

And an example using the second argument (message args)

```tsx
<Command name={"say"} description={"Repeats what you say"}>
  {(msg, ...args) => arg.join(" ")}
</Command>
```

### `<Event />`

| _prop_      | event                                                                          | handler                                                                  |
| ----------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| _type_      | [`keyof ClientEvents`](https://discord.js.org/#/docs/main/stable/class/Client) | Function that accepts the params referenced in the list of client events |
| Description | The event name                                                                 | The handler for this event                                               |

This is a component for listening to custom Discord.js Client events. It's fairly self-explanatory. Here's a couple examples:

```tsx
<Event event={"message"} handler={message => console.log(message.content)} />
<Event event={"guildCreate"} handler={guild => console.log(`Client joined ${guild.name}`)} />
```

## Hooks

If you want to use the client in your own hook, you can use `useClientContext` which returns [`ClientContext`](./src/context.ts) – an object containing the `Client` and `prefix`.

For example:

```tsx
// Custom hook to check if a string starts with the current prefix
function useIsCommand(content: string): boolean {
  const context = useClientContext();
  return content.startsWith(context.prefix);
}
```

## Inhibitors

Stolen from [cookiecord](https://github.com/cookiecord/cookiecord), inhibitors are a way of preventing a command from executing when a specific condition isn't met.

They are very easy to make, and we provide a couple from the constant `CommonInhibitors`. You use them in a `<Command />` component, documented above.

For example:

```tsx
// A command that will only run in a guild
<Command inhibitors={[CommonInhibitors.guildsOnly]} name={"guildsonly"} description={"A command that will run in a guild only"} handler={/*...*/} />
<Command inhibitors={[CommonInhibitors.noBots]} name={"nobots"} description={"A command that cannot be triggered by bots"} handler={/*...*/} />
```

To build an inhibitor, you can import the `Inhibitor` type. Inhibitors stop execution just by throwing a regular error. The error gets caught, and the message is echoed to the channel where the inhibition rose.

##### This project is very experimental, don't use it in production... please.....
