import { Module } from "@nestjs/common";
import { EventCustomService } from "./event-custom.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EventCustomRepository } from "@/schema/event-custom.schema";

@Module({
  imports: [TypeOrmModule.forFeature([EventCustomRepository])],
  providers: [EventCustomService],
  exports: [EventCustomService],
})
export class EventCustomModule {}
