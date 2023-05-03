import * as core from '@actions/core'
import * as github from '@actions/github'
import fetch from 'node-fetch'
import {components} from '@octokit/openapi-types'

type GitHubUser = components['schemas']['public-user']

async function run(): Promise<void> {
  try {
    if (github.context.payload.sender === undefined)
      throw new Error('sender is undefined')
    const username = github.context.payload.sender.login
    core.debug('1')
    const token = core.getInput('github-token')
    core.debug(token)
    const response = await getUserProfile(username)
    if (response.twitter_username === null) {
      core.info('twitter_username is null')
      return
    }
    core.info(`twitter_username is ${response.twitter_username}`)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

async function getUserProfile(username: string): Promise<GitHubUser> {
  const url = `https://api.github.com/users/${username}`
  const response = await fetch(url)

  if (response.ok) {
    const data = (await response.json()) as GitHubUser
    return data
  } else {
    throw new Error(`Error fetching profile: ${await response.json()}`)
  }
}

run()
