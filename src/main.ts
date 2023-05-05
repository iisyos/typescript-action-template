import * as core from '@actions/core'
import {SSM} from 'aws-sdk'
import {SSMParameterGetter} from './services/ssm-parameter-getter'
import {HerokuParameterSetter} from './services/heroku-parameter-setter'
import {ActionRunner} from './services/action-runner'
const ssm = new SSM({region: 'ap-northeast-3'})

async function run(): Promise<void> {
  const parameterGetter = new SSMParameterGetter(ssm)
  const result = await parameterGetter.getParameters({
    path: core.getInput('path'),
    parameters: [],
    nextToken: undefined
  })
  const herokuParameterSetter = new HerokuParameterSetter(
    {
      email: core.getInput('email'),
      token: core.getInput('token'),
      app: core.getInput('app')
    },
    result
  )
  herokuParameterSetter.setParameters()
}

const runner = new ActionRunner({
  name: 'SSM ParameterStore to Heroku shipping',
  cb: run
})
runner.run()
