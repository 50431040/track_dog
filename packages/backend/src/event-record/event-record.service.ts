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
        params,
      } = data;

      // 只对真实的对象进行转换
      let customParams = undefined;
      if (Object.prototype.toString.call(params) === "[object Object]") {
        const temp = {};
        for (const key in params) {
          let value = params[key];
          const valueType = typeof value;
          if (valueType && valueType === "object") {
            value = JSON.stringify(value);
          }
          temp[key] = value;
        }
        customParams = temp;
      }

      const eventRecord = this.eventRecordRepository.create({
        eventId,
        deviceId,
        userId,
        launchId,
        triggerId,
        triggerTime,
        sdkVersion,
        version,
        custom: customParams,
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

  // 获取事件趋势（按天统计次数和设备数）
  async getEventTrend(eventId: string, startTime: string, endTime: string) {
    const where = {
      eventId,
      createTime: {
        $gte: new Date(startTime).getTime(),
        $lte: new Date(endTime).getTime(),
      },
    };
    // 按日期分组，统计每日的次数和设备数
    const result = await this.eventRecordRepository
      .aggregate([
        { $match: where },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: { $toDate: "$createTime" },
              },
            },
            count: { $sum: 1 },
            deviceCount: { $addToSet: "$deviceId" },
          },
        },
        {
          $project: {
            _id: 0,
            date: "$_id",
            count: 1,
            deviceCount: { $size: "$deviceCount" },
          },
        },
      ])
      .toArray();

    return result as unknown as {
      date: string;
      count: number;
      deviceCount: number;
    }[];
  }

  // 获取事件自定义参数信息
  async getCustomParamsInfo(
    eventId: string,
    startTime: string,
    endTime: string,
  ) {
    const where = {
      eventId,
      triggerTime: {
        $gte: new Date(startTime).getTime(),
        $lte: new Date(endTime).getTime(),
      },
      custom: { $exists: true },
    };
    // 查询custom字段每个参数名称对应的总数量、发生设备数（需要去重）
    const queryResult = await this.eventRecordRepository
      .aggregate([
        {
          $match: where,
        },
        {
          $project: {
            customEntries: { $objectToArray: "$custom" },
            deviceId: 1,
          },
        },
        {
          $unwind: "$customEntries",
        },
        {
          $group: {
            _id: "$customEntries.k",
            count: { $sum: 1 },
            deviceCount: { $addToSet: "$deviceId" },
          },
        },
        {
          $project: {
            _id: 0,
            name: "$_id",
            count: 1,
            deviceCount: { $size: "$deviceCount" },
          },
        },
        {
          $sort: { count: -1 },
        },
      ])
      .toArray();

    // 所有参数名称的设备数
    const totalDeviceCount = await this.eventRecordRepository
      .distinct("deviceId", where)
      .then((res) => res.length);

    // 总次数
    const totalCount = await this.eventRecordRepository
      .countBy(where)
      .then((res) => res);

    const result = (
      queryResult as unknown as {
        name: string;
        count: number;
        deviceCount: number;
        deviceCountRatio: string;
        countRatio: string;
      }[]
    ).map((item) => {
      // 百分比
      item.deviceCountRatio = `${Math.round(
        (item.deviceCount / totalDeviceCount) * 100,
      )}%`;
      // 次数占比
      item.countRatio = `${Math.round((item.count / totalCount) * 100)}%`;
      return item;
    });
    return result;
  }
}
