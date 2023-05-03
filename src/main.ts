import * as core from '@actions/core'
import * as github from '@actions/github'

async function run(): Promise<void> {
  try {
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    core.debug(`The event payload: ${payload}`)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
