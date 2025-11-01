import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

interface JwtPayload {
  sub: string;
  login: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(params: { login: string; email: string; password: string; displayName: string }) {
    const existingLogin = await this.usersService.findByLogin(params.login);
    if (existingLogin) throw new BadRequestException('Login already in use');
    const existingEmail = await this.usersService.findByEmail(params.email);
    if (existingEmail) throw new BadRequestException('Email already in use');

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(params.password, salt);

    const user = await this.usersService.create({
      login: params.login,
      email: params.email,
      passwordHash: hash,
      passwordSalt: salt,
      displayName: params.displayName,
    });

    const token = await this.signToken({ sub: user.id, login: user.login });
    return { accessToken: token };
  }

  async login(params: { loginOrEmail: string; password: string }) {
    const byLogin = await this.usersService.findByLogin(params.loginOrEmail);
    const byEmail = byLogin ? null : await this.usersService.findByEmail(params.loginOrEmail);
    const user = byLogin || byEmail;
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(params.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const token = await this.signToken({ sub: user.id, login: user.login });
    return { accessToken: token };
  }

  private async signToken(payload: JwtPayload) {
    return this.jwtService.signAsync(payload);
  }
}


