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
    // const senderId = "iisyos"
    const client = new ApolloClient({
      cache: new InMemoryCache(),
      uri: 'https://api.github.com/graphql',
      headers: {
        authorization: `Bearer ${core.getInput('GRAPHQL_TOKEN')}`
        // authorization: `Bearer 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`
      }
    })
    const {data} = await client.query({
      query: GET_USER_PROFILE,
      variables: {username: senderId}
    })
    if (data === undefined || data.user === undefined)
      throw new Error('user is undefined')
    core.debug(`The user profile: ${JSON.stringify(data, undefined, 2)}`)
    if (data === undefined) throw new Error('user is undefined')
    const twitterUsername = data.user.twitterUsername
    if (twitterUsername === undefined)
      throw new Error('twitterUsername is undefined')
    core.setOutput('twitter_username', twitterUsername)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
