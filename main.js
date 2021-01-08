const dotenv = require('dotenv');
const Discord = require('discord.js');
const fs = require('fs');
const axios = require(`axios`);
const client = new Discord.Client();
client.commands = new Discord.Collection();

function download(url, filename) {
  axios({
    method: 'get',
    url: url,
    responseType: 'stream',
  })
    .then(function (response) {
      response.data.pipe(fs.createWriteStream(filename + '.mp3'));
    })
    .catch(function (error) {
      console.log(error);
    })

}

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}
dotenv.config();

const prefix = process.env.PREFIX;

client.once('ready', () => {
  console.log('Ready!');
});

let enabled = false;

client.login(process.env.TOKEN);




client.on('message', async message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.slice(prefix.length).trim().split(' ');
  const command = args.shift().toLowerCase();
  if (command === 'please') {
    console.log("bruh bruv");
    if (message.member.user.tag === 'j0e#8100') {
      enabled = !enabled;
      message.reply(`uploads turned ${enabled ? "on" : "off"}`);
    }
  }
  else if (command === 'upload') {
    if (enabled) {
      if (message.attachments.first()) {//checks if an attachment is sent
        download(message.attachments.first().url, args[0]);//Function I will show later
      }
      else {
        message.reply('upload something');
      }
    }
    else {
      message.reply('uploads are turned off');
    }
  }
  else {
    if (!client.commands.has(command)) return;
    try {
      await client.commands.get(command).execute(message, args);
    } catch (error) {
      console.error(error);
      message.reply('there was an error trying to execute that command!');
    }
  }

});
