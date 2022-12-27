import { Body, Controller, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { RegistrationGuard } from './guards/registration.guard';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginGuard } from './guards/login.guard';
import { AuthService } from './auth.service';
import { RefreshJwtGuard } from './guards/refreshJwt.guard';
import { RefreshTokenDto } from './dto/refresh-token.dto';


@Controller('auth')
export class AuthController {
  constructor(private userService: UsersService, private authService: AuthService) {
  }

  @UseGuards(LoginGuard)
  @Post('login')
  async loginUser(
    @Body() loginUserDto: LoginUserDto,
    @Res() res: Response,
  ) {
    const user = await this.userService.login(loginUserDto);

    const access = await this.authService.generateAccessToken(user);
    const refresh = await this.authService.generateRefreshToken(user._id as string);

    res.statusCode = HttpStatus.OK;
    res.send({ ...access, ...refresh, username: user.username });
  }

  @UseGuards(RegistrationGuard)
  @Post('registration')
  async registerUser(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
  ) {
    await this.userService.registration(createUserDto);

    res.statusCode = HttpStatus.CREATED;
    res.send('User successfully created');
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Res() res: Response,
  ) {

    const validToken = this.authService.verifyToken(refreshTokenDto.refresh_token);
    const user = await this.userService.findOneUser(refreshTokenDto.username);
    const access = await this.authService.generateAccessToken(user);

    if (validToken?.error) {
      if (validToken?.error === 'jwt expired') {
        const refresh = this.authService.generateRefreshToken(user._id as string);
        res.statusCode = HttpStatus.OK;
        return res.send({ ...access, ...refresh });
      } else {
        res.statusCode = HttpStatus.BAD_REQUEST;
        return res.send({ error: validToken?.error });
      }
    } else {
      res.statusCode = HttpStatus.OK;
      return res.send({ ...access, refresh_token: refreshTokenDto.refresh_token });
    }
  };

}