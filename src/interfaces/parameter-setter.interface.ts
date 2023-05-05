export interface ParameterSetter<T> {
  readonly auth: T
  readonly envParameters: global.Parameter[]
  setParameters(): void
  login?(): void
}
