import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { WebUser } from "src/schema/web-user";
import { InitialUserDTO } from "./dto/initial.dto";
import { LoginDTO } from "./dto/login.dto";

@Injectable()
export class WebUserService {
  constructor(
    @InjectModel(WebUser.name) private webUserModel: Model<WebUser>,
  ) {}

  // 获取管理员帐号
  async getAdminAccount(): Promise<WebUser> {
    const admin = await this.webUserModel
      .findOne({ isAdmin: true, isDelete: false })
      .select(["id"])
      .exec();
    return admin;
  }

  // 创建管理员帐号
  async createAdminAccount(data: InitialUserDTO): Promise<boolean> {
    const adminAccount = new this.webUserModel({
      name: data.name,
      password: data.password,
      email: data.email,
      isAdmin: true,
    });
    await adminAccount.save();
    return true;
  }

  // 登录
  async login(data: LoginDTO): Promise<WebUser> {
    const user = await this.webUserModel
      .findOne({ name: data.name, password: data.password, isDelete: false })
      .select(["id", "name", "email", "isAdmin"])
      .exec();
    return user;
  }
}
