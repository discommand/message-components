import { readdirSync } from 'fs'
import type { MessageComponent } from '../Component'
import type { DeLoadOptions, ReLoadOptions } from '../types'

export const returnDir = (fileDir: string): string[] => {
  const dir: string[] = []
  for (const dirent of readdirSync(fileDir, { withFileTypes: true })) {
    if (dirent.isDirectory()) {
      for (const file of readdirSync(`${fileDir}/${dirent.name}`)) {
        dir.push(`${fileDir}/${dirent.name}/${file}`)
      }
    } else if (dirent.isFile()) {
      dir.push(`${fileDir}/${dirent.name}`)
    }
  }
  return dir
}

export const loadModule = async (dir: string): Promise<MessageComponent[]> => {
  const modules: MessageComponent[] = []
  for (const dirent of readdirSync(dir, { withFileTypes: true })) {
    if (dirent.isDirectory()) {
      for (const file of readdirSync(`${dir}/${dirent.name}`)) {
        const tempModule = await import(`${dir}/${dirent.name}/${file}`)

        if (!tempModule.default) {
          const module: MessageComponent = new tempModule()
          modules.push(module)
        } else {
          const module: MessageComponent = new tempModule.default()
          modules.push(module)
        }
      }
    } else if (dirent.isFile()) {
      const tempModule = await import(`${dir}/${dirent.name}`)

      if (!tempModule.default) {
        const module: MessageComponent = new tempModule()
        modules.push(module)
      } else {
        const module: MessageComponent = new tempModule.default()
        modules.push(module)
      }
    }
  }

  return modules
}

export const deloadModule = (fileDir: string): DeLoadOptions[] => {
  const dir = returnDir(fileDir)
  const modules: DeLoadOptions[] = []

  loadModule(fileDir) //
    .then(module => {
      module.forEach(module => {
        dir.forEach(dir =>
          modules.push({
            module,
            fileDir: dir,
          })
        )
      })
    })

  return modules
}

export const reloadModule = (fileDir: string): ReLoadOptions[] => {
  const dir = returnDir(fileDir)
  const modules: DeLoadOptions[] = []

  loadModule(fileDir) //
    .then(module => {
      module.forEach(module => {
        dir.forEach(dir =>
          modules.push({
            module,
            fileDir: dir,
          })
        )
      })
    })

  return modules
}
