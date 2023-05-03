import * as core from '@actions/core'
import * as github from '@actions/github'
import fetch from 'node-fetch'

async function run(): Promise<void> {
  try {
    if (github.context.payload.sender === undefined)
      throw new Error('sender is undefined')
    const username = github.context.payload.sender.login
    core.debug('1')
    const token = core.getInput('github-token')
    core.debug(token)
    const response = (await getUserProfile(username)) as string

    core.debug(response)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

async function getUserProfile(username: string): Promise<unknown> {
  const url = `https://api.github.com/users/${username}`
  const response = await fetch(url)
  const data = await response.json()

  if (response.ok) {
    return data
  } else {
    throw new Error(
      `Error fetching profile: ${JSON.stringify(data, undefined, 2)}`
    )
  }
}

run()
