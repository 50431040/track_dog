import { Controller, HttpException, HttpStatus, Post } from "@nestjs/common";

import { Get } from "@nestjs/common";
import { WebUserService } from "./web-user.service";
import { Body } from "@nestjs/common/decorators";
import { InitialUserDTO } from "./dto/initial.dto";
import { LoginDTO } from "./dto/login.dto";
import { Public } from "src/auth/public.decorator";
import { AuthService } from "src/auth/auth.service";

@Controller("web/user")
export class WebUserController {
  constructor(
    private readonly webUserService: WebUserService,
    private readonly authService: AuthService,
  ) {}

  // 查询是否存在初始用户
  @Public()
  @Get("/initial")
  async checkInitialUserExists(): Promise<boolean> {
    return this.webUserService.checkInitialUserExists();
  }

  // 创建初始用户
  @Public()
  @Post("/initial")
  async createInitialUser(@Body() body: InitialUserDTO): Promise<boolean> {
    // 查询是否存在
    const isExists = await this.checkInitialUserExists();
    if (isExists) {
      throw new HttpException(
        "管理员账号已存在，请前往登录",
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.webUserService.createInitialUser(body);
  }

  // 登录
  @Public()
  @Post("/login")
  async login(@Body() body: LoginDTO) {
    const user = await this.webUserService.login(body);
    if (!user) {
      throw new HttpException("用户名或密码错误", HttpStatus.BAD_REQUEST);
    }

    const token = await this.authService.login(user);
    return {
      ...user.toJSON(),
      token,
    };
  }
}
