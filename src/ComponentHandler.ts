import { type Client, Collection } from 'discord.js'
import { type MessageComponent } from './Component'
import type { ComponentsHandlerOptions } from './types'
import { interactionCreate } from './utils'
import { deloadModule, loadModule, reloadModule } from './utils/moduleLoader'
import { DeLoadOptions, ReLoadOptions } from './types'

export class ComponentHandler {
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

  public deload(options: DeLoadOptions[]) {
    options.forEach(option => {
      const { module, fileDir } = option
      this.modules.delete(module.name)
      delete require.cache[require.resolve(fileDir)]
    })
  }

  public reload(options: ReLoadOptions[]) {
    options.forEach(option => {
      const { module, fileDir } = option
      this.modules.delete(module.name)
      delete require.cache[require.resolve(fileDir)]
      this.load([module])
    })
  }

  public async loadAll() {
    this.load(await loadModule(this.options.directory))
    interactionCreate(this)
  }

  public reloadAll() {
    this.reload(reloadModule(this.options.directory))
  }

  public deloadAll() {
    this.deload(deloadModule(this.options.directory))
  }
}
