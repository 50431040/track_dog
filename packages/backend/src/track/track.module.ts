import { Module } from "@nestjs/common";
import { TrackController } from "./track.controller";
import { QueueModule } from "@/queue/queue.module";

@Module({
  imports: [QueueModule],
  controllers: [TrackController],
})
export class TrackModule {}
