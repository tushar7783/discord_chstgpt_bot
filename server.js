require("dotenv/config");
const { Client, GatewayIntentBits } = require("discord.js");
const { OpenAI } = require("openai");

// discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
});
client.on("ready", () => {
  console.log("I am on 🤖");
});
// openai
const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

// console.log(openai);
const IGNORE_PREFIX = "!";
const CHANNEL = ["1208725029509144618"];
client.on("messageCreate", async (message) => {
  if (message.content.startsWith(IGNORE_PREFIX)) return;
  if (!CHANNEL.includes(message.channelId)) return;
  await message.channel.sendTyping();
  const sendTypingInterval = setInterval(() => {
    message.channel.sendTyping();
  }, 5);
  const response = await openai.chat.completions
    .create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          // name,
          role: "system",
          content: "chat gpt is the a friendly tool",
        },
        {
          // name,
          role: "user",
          content: message.content,
        },
      ],
    })
    .catch((error) => {
      console.log(error, "\n error of response");
    });

  if (!response) {
    message.reply(
      "I'm having some trouble with OpenAI API ,try again in a moment "
    );
  }
  // console.log(">>>>>>>>>>>>>>>>>>>>>>>>", response);
  message.reply(response.choices[0].message.content);
  clearInterval(sendTypingInterval);

  // if (
  //   (message.content == "hii" ||
  //     message.content == "hi" ||
  //     message.content == "Hey" ||
  //     message.content == "Hello" ||
  //     message.content == "hello" ||
  //     message.content == "hey") &&
  //   !message.author.bot
  // ) {
  //   message.reply({
  //     // content: "hii from bot",
  //     content: `Hello! How can I assist you today?`,
  //   });
  // }

  // if (message.content == "what is your name") {
  //   message.reply({
  //     // content: "hii from bot",
  //     content: `I'm an AI language model created by OpenAI called ChatGPT. You can call me ChatGPT! How can I assist you further?`,
  //   });
  // }
});

client.login(process.env.TOKEN);
