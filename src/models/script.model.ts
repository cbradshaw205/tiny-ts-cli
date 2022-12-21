export interface Script {
  script: Function,
  args: {
    name: string,
    type: string,
    required: boolean
  }[]
}