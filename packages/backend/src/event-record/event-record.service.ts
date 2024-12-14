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
    const where = {
      eventId: { $in: eventIds },
    };

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

    const countResult = (await this.eventRecordRepository
      .aggregate([
        {
          $match: where,
        },
        {
          $group: {
            _id: "$eventId",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $skip: (query.page - 1) * query.pageSize },
        { $limit: query.pageSize },
      ])
      .toArray()) as unknown as { _id: string; count: number }[];

    // 只对top N的事件计算设备数
    const eventDetails = await Promise.all(
      countResult.map(async (item) => {
        const deviceCount = await this.eventRecordRepository
          .distinct("deviceId", { ...where, eventId: item._id })
          .then((res) => res.length);

        return {
          eventId: item._id,
          count: item.count,
          deviceCount,
        };
      }),
    );
    return [eventDetails, distinctResult?.length || 0];
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
                date: { $toDate: "$triggerTime" },
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
      item.deviceCountRatio = `${((item.deviceCount / totalDeviceCount) * 100).toFixed(2)}%`;
      // 次数占比
      item.countRatio = `${((item.count / totalCount) * 100).toFixed(2)}%`;
      return item;
    });
    return result;
  }

  // 获取事件自定义参数值
  async getCustomParamsValue(
    eventId: string,
    startTime: string,
    endTime: string,
    name: string,
  ) {
    const where = {
      eventId,
    };

    if (startTime) {
      where["triggerTime"] = {
        $gte: new Date(startTime).getTime(),
        $lte: new Date(endTime).getTime(),
      };
    }

    // 查询custom中name字段所有的值以及占比
    const queryResult = (await this.eventRecordRepository
      .aggregate([
        { $match: where },
        { $unwind: "$custom" },
        { $match: { [`custom.${name}`]: { $exists: true } } },
        {
          $group: {
            _id: `$custom.${name}`,
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        {
          $project: {
            _id: 0,
            value: "$_id",
            count: 1,
          },
        },
      ])
      .toArray()) as unknown as {
      value: string;
      count: number;
      ratio: string;
    }[];

    const totalCount = queryResult.reduce((acc, item) => acc + item.count, 0);

    const result = queryResult.map((item) => {
      item.ratio = `${((item.count / totalCount) * 100).toFixed(2)}%`;
      return item;
    });

    return result;
  }
}
