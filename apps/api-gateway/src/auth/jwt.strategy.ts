import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { env } from 'node:process'

env.JWT_SECRET = ''
// ARRUMAR URGENTE

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: env.JWT_SECRET!,
    })
  }

  validate(payload: { sub: string; email: string }) {
    return { id: payload.sub, email: payload.email }
  }
}
