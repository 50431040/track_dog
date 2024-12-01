import { Public } from "@/auth/public.decorator";
import { QueueService } from "@/queue/queue.service";
import { Body, Controller, Post, Req } from "@nestjs/common";
import { Request } from "express";

@Controller("track")
export class TrackController {
  constructor(private readonly queueService: QueueService) {}

  // 事件上报入口
  @Public()
  @Post()
  async track(@Body() body: any, @Req() req: Request) {
    const ip = req.ip;
    await this.queueService.eventEntryProducer({
      ip,
      data: body,
    });
    return true;
  }
}
