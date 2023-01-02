import { type Client, Collection } from 'discord.js'
import { type MessageComponent } from './Component'
import type { ComponentsHandlerOptions } from './types'
import { readdirSync } from 'fs'
import { interactionCreate } from './utils'

export class ComponentsHandler {
  public modules: Collection<string, MessageComponent> = new Collection()
  public constructor(
    public readonly client: Client,
    public readonly options: ComponentsHandlerOptions
  ) {}

  public load(modules: MessageComponent[]) {
    modules.forEach(module => {
      this.modules.set(module.name, module)
      console.log(module.name)
    })
  }

  public loadAll() {
    const modules: MessageComponent[] = []
    for (const dirent of readdirSync(this.options.directory, {
      withFileTypes: true,
    })) {
      if (dirent.isDirectory()) {
        for (const file of readdirSync(
          `${this.options.directory}/${dirent.name}`
        )) {
          const tempModule = require(`${this.options.directory}/${dirent.name}/${file}`)
          if (!tempModule.default) {
            const module: MessageComponent = new tempModule()
            modules.push(module)
          } else {
            const module: MessageComponent = new tempModule.default()
            modules.push(module)
          }
        }
      } else if (dirent.isFile()) {
        const tempModule = require(`${this.options.directory}/${dirent.name}`)
        if (!tempModule.default) {
          const module: MessageComponent = new tempModule()
          modules.push(module)
        } else {
          const module: MessageComponent = new tempModule.default()
          modules.push(module)
        }
      }
    }

    this.load(modules)
    interactionCreate(this)
  }
}
