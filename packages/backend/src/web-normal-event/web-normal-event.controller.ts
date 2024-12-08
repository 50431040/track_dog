import { GetNormalEventListDto } from "@/web-normal-event/dto/get-list.dto";
import { NormalEventService } from "@/normal-event/normal-event.service";
import { Controller, Get, NotFoundException, Query, Req } from "@nestjs/common";
import { ApplicationService } from "@/application/application.service";
import { EventRecordService } from "@/event-record/event-record.service";

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

    // 获取普通事件列表
    const [list, total] =
      await this.normalEventService.getNormalEventList(query);

    // 查询事件记录数据
    const recordData = await Promise.all(
      list.map(async (item) => {
        const record = await this.eventRecordService.getEventRecordById(
          item._id.toString(),
        );
        return {
          ...item,
          ...record,
        };
      }),
    );

    return {
      list: recordData,
      total,
    };
  }
}
