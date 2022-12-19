import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from '../../users/users.service';


@Injectable()
export class RefreshJwtGuard implements CanActivate {
  constructor(private usersService: UsersService) {
  }

  async canActivate(
    context: ExecutionContext,
    //@ts-ignore
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const { refresh_token, username } = request.body;

    if (!refresh_token) {
      throw new UnauthorizedException('Field refresh_token is required!');
    }

    if (!username) {
      throw  new UnauthorizedException('Field user is required');
    }

    const user = await this.usersService.findOneUser(username);

    if (!user) {
      throw  new UnauthorizedException('User is not exist');
    }

    return true;
  }
}