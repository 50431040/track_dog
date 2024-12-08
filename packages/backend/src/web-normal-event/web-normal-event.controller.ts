import { GetNormalEventListDto } from "@/web-normal-event/dto/get-list.dto";
import { NormalEventService } from "@/normal-event/normal-event.service";
import { Controller, Get, NotFoundException, Query, Req } from "@nestjs/common";
import { ApplicationService } from "@/application/application.service";
import { EventRecordService } from "@/event-record/event-record.service";
import { NormalEventRepository } from "@/schema/event.schema";
import { EventRecordRepository } from "@/schema/event-record.schema";

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
}
