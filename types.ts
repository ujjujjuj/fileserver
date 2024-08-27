declare module "express-session" {
  interface SessionData {
    username: string
  }
}

export type DbData = {
  files: Array<{
    name: string
    hash: string
    mime: string
  }>
}
