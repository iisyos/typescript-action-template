import {ParameterSetter} from '../interfaces/parameter-setter.interface'
import {HerokuAuth} from '../types/heroku-util.type'
import {execSync} from 'child_process'

export class HerokuParameterSetter implements ParameterSetter<HerokuAuth> {
  auth: HerokuAuth
  envParameters: global.Parameter[]
  constructor(auth: HerokuAuth, envParameters: global.Parameter[]) {
    this.auth = auth
    this.envParameters = envParameters
  }

  setParameters(): void {
    this.login()
    for (const {Name, Value} of this.envParameters) {
      const command = `heroku config:set ${Name}=${Value} --app ${this.auth.app}`
      execSync(command)
    }
  }

  login(): void {
    execSync(`cat >~/.netrc <<EOF
      machine api.heroku.com
          login ${this.auth.email}
          password ${this.auth.token}
      machine git.heroku.com
          login ${this.auth.email}
          password ${this.auth.token}
      EOF`)
    execSync(`git config user.name "Heroku-Set-Parameter"`)
    execSync(`git config user.email "${this.auth.email}"`)
  }
}
