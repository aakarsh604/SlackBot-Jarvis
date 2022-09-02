require("dotenv").config();
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET;
const DICTIONARY_KEY = process.env.DICTIONARY_KEY;

const { App } = require("@slack/bolt");
const axios = require("axios");

//new app object
const app = new App({
  token: SLACK_BOT_TOKEN,
  signingSecret: SLACK_SIGNING_SECRET,
});

app.message("means?", async ({ message, say }) => {
  let word = message.text.split("means?").join("").trim();
  invokeDictionary(word, say);
});

app.message("hey jarvis", async ({ message, say }) => {
  say("Hey man! How can I help you?");
});

(async () => {
  //Start your app
  await app.start(process.env.port || 3000);
  console.log("⚡Bolt app is running !");
})();

const invokeDictionary = (word, say) => {
  axios
    .get(
      `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${DICTIONARY_KEY}`
    )
    .then(async (res) => {
      if (res.data[0].shortdef === undefined) {
        await say("Sorry! That word doesn't seem to be familiar");
      } else {
        await say(`${word}: listen`)
        for (let i = 0; i < res.data.length; i++) {
          await say(
            `Definition ${i + 1}) ${res.data[i].fl} : ${
              res.data[i].shortdef[0]
            }`
          );
        }
      }
    });
};
