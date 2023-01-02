import { MessageComponent } from '../..'
import { ButtonInteraction } from 'discord.js'

export default class extends MessageComponent {
  public constructor() {
    super('a')
  }
  execute(interaction: ButtonInteraction) {
    interaction.update({ content: 'asdfjkl;asdfjkl;asdf', components: [] })
  }
}
