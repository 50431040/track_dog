import { Module } from "@nestjs/common";
import { NormalEventService } from "./normal-event.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NormalEventRepository } from "@/schema/event.schema";

@Module({
  imports: [TypeOrmModule.forFeature([NormalEventRepository])],
  providers: [NormalEventService],
  exports: [NormalEventService],
})
export class NormalEventModule {}
