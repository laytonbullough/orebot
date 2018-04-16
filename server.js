require('dotenv').config()
const { logger } = require('./utils')
const { cors } = require('./middleware')
const express = require('express')
const Discord = require('discord.io')

const { ore } = require('./lib')

const app = express()

app.use(logger)

app.use(cors);

app.get('/:number', (req, res) => {
  const number = parseInt(req.params.number) || 1
  const rolls = ore.roll(number)
  res.status(200).json(rolls)
})

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).send('Something went wrong.')
});

app.all('*', (req, res) => {
  res.status(404).send('Not found.')
});


const bot = new Discord.Client({
  token: process.env.TOKEN || '',
  autorun: true
})

bot.on('ready', (evt) => {
  console.info('Connected');
  console.info('Logged in as: ');
  console.info(bot.username + ' - (' + bot.id + ')');
})

bot.on('message', (user, userID, channelID, message, evt) => {
  if (message.substring(0, 1) == '!') {
    var args = message.substring(1).split(' ');
    var cmd = args[0];

    args = args.splice(1);
    switch(cmd) {
      // !ping
      case 'ping':
      bot.sendMessage({
        to: channelID,
        message: 'Pong!'
      });
      break;
      // Just add any case commands if you want to..
    }
  }
})

app.listen(process.env.PORT || 80)
