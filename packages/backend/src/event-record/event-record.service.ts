import { INormalEvent } from "@/enum/event";
import { EventRecordRepository } from "@/schema/event-record.schema";
import { GetNormalEventListDto } from "@/web-normal-event/dto/get-list.dto";
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

  // 给定事件id列表里面，事件总数量最多的前N个事件
  async getTopNEvent(query: GetNormalEventListDto, eventIds: string[]) {
    const where = { eventId: { $in: eventIds } };
    if (query.startTime) {
      where["triggerTime"] = {
        $gte: new Date(query.startTime).getTime(),
        $lte: new Date(query.endTime).getTime(),
      };
    }

    // 查询唯一的eventId总数
    const distinctResult = await this.eventRecordRepository.distinct(
      "eventId",
      where,
    );

    const result = await this.eventRecordRepository
      .aggregate([
        { $match: where },
        {
          $group: {
            _id: "$eventId",
            count: { $sum: 1 },
            deviceCount: { $addToSet: "$deviceId" },
          },
        },
        {
          $project: {
            eventId: "$_id",
            count: 1,
            deviceCount: { $size: "$deviceCount" },
          },
        },
        { $sort: { count: -1, deviceCount: -1, eventId: -1 } },
        { $skip: (query.page - 1) * query.pageSize },
        { $limit: query.pageSize },
      ])
      .toArray();

    return [result, distinctResult?.length || 0];
  }
}
