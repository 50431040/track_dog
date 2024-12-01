import { IClickEvent } from "@/enum/event";
import { EventRecordRepository } from "@/schema/event-record.schema";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class EventRecordService {
  constructor(
    @InjectRepository(EventRecordRepository)
    private readonly eventRecordRepository: Repository<EventRecordRepository>,
  ) {}

  logger = new Logger(EventRecordService.name);

  async saveEventRecord(eventId: string, data: IClickEvent) {
    try {
      const {
        deviceId,
        userId,
        launchId,
        triggerId,
        triggerTime,
        sdkVersion,
        version,
      } = data;

      const eventRecord = this.eventRecordRepository.create({
        eventId,
        deviceId,
        userId,
        launchId,
        triggerId,
        triggerTime,
        sdkVersion,
        version,
      });

      return await this.eventRecordRepository.save(eventRecord);
    } catch (error) {
      this.logger.error("保存事件记录失败", error);
    }
  }
}
