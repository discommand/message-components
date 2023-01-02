import type { ComponentsHandler } from '../ComponentsHandler'
import { Events, InteractionType } from 'discord.js'

export function interactionCreate(handler: ComponentsHandler) {
  handler.client.on(Events.InteractionCreate, async interaction => {
    if (interaction.type === InteractionType.MessageComponent) {
      const module = handler.modules.get(interaction.customId)

      if (!module) return

      try {
        await module.execute(interaction)
      } catch (error) {
        console.log(error)
      }
    }
  })
}
