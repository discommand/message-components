import {
  Client,
  GatewayIntentBits,
  ComponentType,
  ActionRowBuilder,
  ButtonStyle,
  ButtonBuilder,
} from 'discord.js'
import { ComponentsHandler } from '..'
import { join } from 'path'
const { token } = require('./config.json')

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
  ],
})

const handler = new ComponentsHandler(client, {
  directory: join(__dirname, 'components'),
})

handler.loadAll()

client.login(token)

client.on('messageCreate', msg => {
  if (msg.author.bot) return
  if (msg.content.startsWith('msg'))
    msg.reply({
      content: 'a',
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId('a')
            .setLabel('a')
            .setStyle(ButtonStyle.Primary)
        ),
      ],
    })
})
