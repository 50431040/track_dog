import { GetNormalEventListDto } from "@/web-normal-event/dto/get-list.dto";
import { NormalEventService } from "@/normal-event/normal-event.service";
import { Controller, Get, NotFoundException, Query, Req } from "@nestjs/common";
import { ApplicationService } from "@/application/application.service";
import { EventRecordService } from "@/event-record/event-record.service";
import { NormalEventRepository } from "@/schema/event.schema";
import { EventRecordRepository } from "@/schema/event-record.schema";
import { GetEventCustomParamsDto, GetEventTrendDto } from "./dto/trend.dto";

@Controller("web/normal-event")
export class WebNormalEventController {
  constructor(
    private readonly normalEventService: NormalEventService,
    private readonly applicationService: ApplicationService,
    private readonly eventRecordService: EventRecordService,
  ) {}
  @Get()
  async getNormalEventList(@Query() query: GetNormalEventListDto, @Req() req) {
    const userId = req.user.id;
    // 校验应用权限
    const application =
      await this.applicationService.getApplicationByIdWithPermission(
        query.appId,
        userId,
      );

    if (!application) {
      throw new NotFoundException();
    }

    // 有关键字，先匹配事件
    const list: NormalEventRepository[] =
      await this.normalEventService.matchEventByName(
        query.appId,
        query.keyword,
      );

    // 事件总数量最多的前N个事件
    const [topNEvent, total] = await this.eventRecordService.getTopNEvent(
      query,
      list.map((item) => item._id.toString()),
    );

    const result = (topNEvent as EventRecordRepository[]).map((item) => {
      const event = list.find((e) => e._id.toString() === item.eventId);
      return {
        ...event,
        ...item,
      };
    });

    return {
      list: result,
      total,
    };
  }

  // 获取事件趋势（按天）
  @Get("trend")
  async getEventTrend(@Query() query: GetEventTrendDto, @Req() req) {
    const userId = req.user.id;
    // 应用权限校验
    const application =
      await this.applicationService.getApplicationByIdWithPermission(
        query.appId,
        userId,
      );

    if (!application) {
      throw new NotFoundException();
    }

    // 事件权限校验
    const event = await this.normalEventService.validateEvent(
      query.appId,
      query.eventId,
    );
    if (!event) {
      throw new NotFoundException();
    }

    // 获取事件趋势
    const trendData = await this.eventRecordService.getEventTrend(
      query.eventId,
      query.startTime,
      query.endTime,
    );

    // trend中缺失数据的日期都赋值为0
    const result = [];
    for (
      let d = new Date(query.startTime);
      d <= new Date(query.endTime);
      d.setDate(d.getDate() + 1)
    ) {
      const date = new Date(d).toISOString().split("T")[0];
      const item = trendData.find((t) => t.date === date);
      if (!item) {
        result.push({
          date,
          count: 0,
          deviceCount: 0,
        });
      } else {
        result.push(item);
      }
    }

    return result;
  }

  // 获取事件自定义参数信息
  @Get("custom")
  async getEventCustomParams(
    @Query() query: GetEventCustomParamsDto,
    @Req() req,
  ) {
    const userId = req.user.id;
    // 应用权限校验
    const application =
      await this.applicationService.getApplicationByIdWithPermission(
        query.appId,
        userId,
      );

    if (!application) {
      throw new NotFoundException();
    }

    // 事件权限校验
    const event = await this.normalEventService.validateEvent(
      query.appId,
      query.eventId,
    );
    if (!event) {
      throw new NotFoundException();
    }

    // 获取事件自定义参数信息
    const customParams = await this.eventRecordService.getCustomParamsInfo(
      query.eventId,
      query.startTime,
      query.endTime,
    );

    return customParams;
  }
}
