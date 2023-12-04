declare namespace Express {
  export interface Request {
    user?: {
      email: string
      sub: number
      refreshToken?: string
    }
  }
}
