import { IClickEvent } from "@/enum/event";
import { ClickEventRepository } from "@/schema/event.schema";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class ClickEventService {
  constructor(
    @InjectRepository(ClickEventRepository)
    private readonly eventRepository: Repository<ClickEventRepository>,
  ) {}

  logger = new Logger(ClickEventService.name);
  // 保存点击事件
  async saveClickEvent(data: IClickEvent) {
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
      this.logger.error("保存点击事件失败", error.code);
    }
  }
}
