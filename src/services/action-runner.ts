import * as core from '@actions/core'

export class ActionRunner {
  constructor(private readonly options: {name: string; cb: () => unknown}) {}
  async run(): Promise<void> {
    try {
      core.notice(`Action started: ${this.options.name}`)
      await this.options.cb()
      core.notice('Action completed.')
    } catch (error) {
      if (error instanceof Error) {
        core.setFailed(error?.message)
      }
    }
  }
}
