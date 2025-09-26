declare module '#auth-utils' {
  interface User {
    name: string
    email: string
    sub: string
    roles: string[]
  }
}

export {}
