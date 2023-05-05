export interface ParameterGetter<T, U> {
  parameterStore: T
  getParameters(arg: Partial<U>): Promise<global.Parameter[]>
}
