import { INormalEvent } from "@/enum/event";
import { NormalEventRepository } from "@/schema/event.schema";
import { GetNormalEventListDto } from "@/web-normal-event/dto/get-list.dto";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MongoRepository } from "typeorm";

@Injectable()
export class NormalEventService {
  constructor(
    @InjectRepository(NormalEventRepository)
    private readonly eventRepository: MongoRepository<NormalEventRepository>,
  ) {}

  logger = new Logger(NormalEventService.name);
  // 保存普通事件
  async saveNormalEvent(data: INormalEvent) {
    const { appId, type, name } = data;
    try {
      const event = this.eventRepository.create({
        appId,
        type,
        name,
      });
      return await this.eventRepository.save(event);
    } catch (error) {
      // 索引冲突，查询
      if (error.code === 11000) {
        const event = await this.eventRepository.findOne({
          where: { appId, type, name },
        });
        return event;
      }
      this.logger.error("��存点击事件失败", error.code);
    }
  }

  // 获取普通事件列表
  async getNormalEventList(query: GetNormalEventListDto) {
    const { appId, keyword, startTime, endTime } = query;
    const where = { appId };
    if (keyword) {
      where["name"] = { $regex: keyword, $options: "i" };
    }
    if (startTime && endTime) {
      where["createTime"] = {
        $gte: new Date(startTime).getTime(),
        $lte: new Date(endTime).getTime(),
      };
    }
    const data = await this.eventRepository.findAndCount({
      where,
      select: ["_id", "name", "type", "createTime"],
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      order: {
        createTime: "DESC",
      },
    });
    return data;
  }
}
