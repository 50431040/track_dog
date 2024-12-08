import { INormalEvent } from "@/enum/event";
import { EventRecordRepository } from "@/schema/event-record.schema";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MongoRepository } from "typeorm";

@Injectable()
export class EventRecordService {
  constructor(
    @InjectRepository(EventRecordRepository)
    private readonly eventRecordRepository: MongoRepository<EventRecordRepository>,
  ) {}

  logger = new Logger(EventRecordService.name);

  async saveEventRecord(eventId: string, data: INormalEvent) {
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

  // 获取事件记录列表
  async getEventRecordById(_id: string) {
    // 查询每个事件的总事件数、事件设备数
    const count = await this.eventRecordRepository.count({
      eventId: _id,
    });

    const deviceCountResult = (await this.eventRecordRepository
      .aggregate([
        { $match: { eventId: _id } },
        { $group: { _id: "$deviceId" } },
        { $count: "deviceCount" },
      ])
      .toArray()) as unknown as { deviceCount: number }[];

    return {
      _id,
      count,
      deviceCount:
        deviceCountResult.length > 0 ? deviceCountResult[0].deviceCount : 0,
    };
  }
}
