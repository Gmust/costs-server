import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common'
import {Observable} from 'rxjs'
import {AuthService} from '../auth.service'
import * as bcrypt from 'bcryptjs'

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(private authService: AuthService) {
  }

  async canActivate(
    context: ExecutionContext,
    //@ts-ignore
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()
    const {username, password} = request.body
    const user = await this.authService.validateUser(username)


    if (!user) {
      throw  new UnauthorizedException(`Check out login or password!`)
    }

    const dbPassword = user.password
    const match = await bcrypt.compare(password, dbPassword)

    if (!match) {
      throw  new UnauthorizedException(`Check out login or password!`)
    }

    return true
  }
}