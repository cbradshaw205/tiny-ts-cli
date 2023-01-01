export interface TinyScript {
  run(): number | Promise<number>,
}