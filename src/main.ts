import * as core from '@actions/core'
import * as github from '@actions/github'
import {ApolloClient, gql, InMemoryCache} from '@apollo/client/core'
import 'cross-fetch/polyfill'

const GET_USER_PROFILE = gql`
  query GetUserProfile($username: String!) {
    user(login: $username) {
      name
      login
      twitterUsername
    }
  }
`

async function run(): Promise<void> {
  try {
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    core.debug(`The event payload: ${payload}`)
    if (github.context.payload.sender === undefined)
      throw new Error('sender is undefined')
    const senderId = github.context.payload.sender.login
    const client = new ApolloClient({
      cache: new InMemoryCache(),
      uri: 'https://api.github.com/graphql',
      headers: {
        authorization: `Bearer ${core.getInput('GITHUB_TOKEN')}`
      }
    })
    const {data} = await client.query({
      query: GET_USER_PROFILE,
      variables: {senderId}
    })
    core.debug(`The user profile: ${JSON.stringify(data, undefined, 2)}`)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
