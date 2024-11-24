import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { WebUser } from "../schema/web-user";
import { RedisService } from "@liaoliaots/nestjs-redis";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async login(userInfo: WebUser) {
    const payload = {
      id: userInfo.id,
      name: userInfo.name,
      isAdmin: userInfo.isAdmin,
    };
    const token = this.jwtService.sign(payload);
    await this.redisService.getOrNil().set(`user:token:${userInfo.id}`, token);
    return token;
  }

  async validate(token: string) {
    const temp = token.split(" ");
    if (temp.length !== 2) {
      throw new UnauthorizedException();
    }

    // 和 Redis 中的进行比较
    const content = temp[1];
    let payload;
    try {
      payload = this.jwtService.verify(content);
    } catch (err) {
      throw new UnauthorizedException();
    }
    const latestToken = await this.redisService
      .getOrNil()
      .get(`user:token:${payload.id}`);

    if (latestToken !== content) {
      throw new UnauthorizedException();
    }
  }
}
