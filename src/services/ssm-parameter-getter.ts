import {ParameterGetter} from '../interfaces/parameter-getter.interface'
import {SSM} from 'aws-sdk'
import {SSMParameterGetterArgs, SSMParameters} from '../types/ssm-util.type'

export class SSMParameterGetter
  implements ParameterGetter<SSM, SSMParameterGetterArgs>
{
  parameterStore: SSM
  constructor(parameterStore: SSM) {
    this.parameterStore = parameterStore
  }
  async getParameters({
    path,
    parameters,
    nextToken
  }: SSMParameterGetterArgs): Promise<SSMParameters[]> {
    const ssmParams: SSM.Types.GetParametersByPathRequest = {
      Path: path,
      MaxResults: 10,
      NextToken: nextToken
    }
    const result = await this.parameterStore
      .getParametersByPath(ssmParams)
      .promise()
    if (result.Parameters) {
      for (const parameter of result.Parameters) {
        if (parameter.Value && parameter.Name) {
          parameter.Name = parameter.Name.replace(path, '')
          parameters.push(
            (({Name, Value}) => ({
              Name,
              Value
            }))(parameter) as SSMParameters
          )
        }
      }
    }
    if (result.NextToken) {
      await this.getParameters({path, parameters, nextToken: result.NextToken})
    }
    return parameters
  }
}
