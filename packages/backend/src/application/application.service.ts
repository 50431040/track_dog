import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository } from "typeorm";
import { CreateApplicationDto } from "./dto/create.dto";
import { UpdateApplicationDto } from "./dto/update.dto";
import { ApplicationRepository } from "@/schema/application.schema";
import { ObjectId } from "mongodb";
import { GetApplicationListDto } from "./dto/get-list.dto";

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(ApplicationRepository)
    private applicationModel: Repository<ApplicationRepository>,
  ) {}

  // 获取应用
  async queryApplicationList(creator: string, params: GetApplicationListDto) {
    return this.applicationModel.findAndCount({
      where: {
        creator,
        ...(params.keyword && params.keyword.length > 0
          ? { name: Like(`%${params.keyword}%`) }
          : {}),
      },
      select: ["_id", "name", "icon", "platform", "createTime"],
      skip: (params.page - 1) * params.pageSize,
      take: params.pageSize,
    });
  }

  // 创建应用
  async createApplication(application: CreateApplicationDto, creator: string) {
    const newApplication = this.applicationModel.create({
      name: application.name,
      icon: application.icon,
      platform: application.platform,
      creator,
    });
    await this.applicationModel.save(newApplication).catch((error) => {
      throw new BadRequestException(error);
    });
    return {
      _id: newApplication._id.toString(),
      name: newApplication.name,
      icon: newApplication.icon,
      platform: newApplication.platform,
    };
  }

  // 更新应用
  async updateApplication(application: UpdateApplicationDto) {
    const updateResult = await this.applicationModel.update(
      { _id: ObjectId.createFromHexString(application._id) },
      {
        name: application.name,
        icon: application.icon,
        platform: application.platform,
      },
    );
    return updateResult.affected > 0;
  }
}
