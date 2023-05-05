import {PSParameterName, NextToken} from 'aws-sdk/clients/ssm'

export type SSMParameterGetterArgs = {
  path: PSParameterName
  parameters: SSMParameters[]
  nextToken?: NextToken
}

export type SSMParameters = {
  Name: PSParameterName
  Value: string
}
