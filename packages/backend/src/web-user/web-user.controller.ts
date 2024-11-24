import { Controller, HttpException, HttpStatus, Post } from "@nestjs/common";

import { Get } from "@nestjs/common";
import { WebUserService } from "./web-user.service";
import { Body } from "@nestjs/common/decorators";
import { InitialUserDTO } from "./dto/initial.dto";
import { LoginDTO } from "./dto/login.dto";

@Controller("web/user")
export class WebUserController {
  constructor(private readonly webUserService: WebUserService) {}

  // 查询是否存在初始用户
  @Get("/initial")
  async checkInitialUserExists(): Promise<boolean> {
    return this.webUserService.checkInitialUserExists();
  }

  // 创建初始用户
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
  @Post("/login")
  async login(@Body() body: LoginDTO) {
    const user = await this.webUserService.login(body);
    return user;
  }
}
