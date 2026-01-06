declare module '#auth-utils' {
  interface User {
    'email': string
    'email_verified': boolean
    'family_name': string
    'given_name': string
    'locale': string | null
    'name': string
    'preferred_username': string
    'roles': string[]
    'sub': string
    'updated_at': number
    'urn:zitadel:iam:org:project:roles': {
      [role: string]: {
        [orgId: string]: string
      }
    }
  }
}

export {}
