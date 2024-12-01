import { Module } from "@nestjs/common";
import { ClickEventService } from "./click-event.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClickEventRepository } from "@/schema/event.schema";

@Module({
  imports: [TypeOrmModule.forFeature([ClickEventRepository])],
  providers: [ClickEventService],
  exports: [ClickEventService],
})
export class ClickEventModule {}
