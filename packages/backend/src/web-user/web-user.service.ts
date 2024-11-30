import { Injectable } from "@nestjs/common";
import { WebUserRepository } from "@/schema/web-user.schema";
import { InitialUserDTO } from "./dto/initial.dto";
import { LoginDTO } from "./dto/login.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class WebUserService {
  constructor(
    @InjectRepository(WebUserRepository)
    private readonly webUserRepository: Repository<WebUserRepository>,
  ) {}

  // 获取管理员帐号
  async getAdminAccount(): Promise<WebUserRepository | undefined> {
    const admin = await this.webUserRepository.findOne({
      where: {
        isAdmin: true,
        isDelete: false,
      },
      select: ["_id"],
    });
    return admin;
  }

  // 创建管理员帐号
  async createAdminAccount(data: InitialUserDTO): Promise<boolean> {
    const adminAccount = this.webUserRepository.create({
      name: data.name,
      password: data.password,
      email: data.email,
      isAdmin: true,
    });
    await this.webUserRepository.insert(adminAccount);
    return true;
  }

  // 登录
  async login(data: LoginDTO): Promise<WebUserRepository> {
    const user = await this.webUserRepository.findOne({
      where: { name: data.name, password: data.password, isDelete: false },
      select: ["_id", "name", "email", "isAdmin"],
    });
    return user;
  }
}
