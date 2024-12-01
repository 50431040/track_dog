import { EventCustomRepository } from "@/schema/event-custom.schema";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class EventCustomService {
  constructor(
    @InjectRepository(EventCustomRepository)
    private readonly eventCustomRepository: Repository<EventCustomRepository>,
  ) {}

  async saveEventCustomParam(
    eventId: string,
    eventRecordId: string,
    params: Record<string, any>,
  ) {
    // 批量插入
    const eventCustomParams = this.eventCustomRepository.create(
      Object.entries(params).map(([key, value]) => {
        value = value || "";
        // value 根据不同的类型转换为字符串
        const valueType = typeof value;
        if (valueType === "object" || Array.isArray(value)) {
          value = JSON.stringify(value);
        }

        return {
          eventId,
          eventRecordId,
          name: key,
          value,
        };
      }),
    );
    return await this.eventCustomRepository.save(eventCustomParams);
  }
}
