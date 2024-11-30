import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateApplicationDto } from "./dto/create.dto";
import { UpdateApplicationDto } from "./dto/update.dto";
import { ApplicationRepository } from "@/schema/application.schema";
import { ObjectId } from "mongodb";

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(ApplicationRepository)
    private applicationModel: Repository<ApplicationRepository>,
  ) {}

  // 创建应用
  async createApplication(
    application: CreateApplicationDto,
    creator: ObjectId,
  ) {
    const newApplication = this.applicationModel.create({
      name: application.name,
      icon: application.icon,
      platform: application.platform,
      creator,
    });
    await this.applicationModel.insert(newApplication);
    return {
      id: newApplication._id.toString(),
      name: newApplication.name,
      icon: newApplication.icon,
      platform: newApplication.platform,
    };
  }

  // 更新应用
  async updateApplication(application: UpdateApplicationDto) {
    const updateResult = await this.applicationModel.update(
      { _id: application.id as any },
      {
        name: application.name,
        icon: application.icon,
        platform: application.platform,
      },
    );
    return updateResult.affected > 0;
  }
}
