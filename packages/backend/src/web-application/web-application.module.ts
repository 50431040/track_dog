import { Module } from "@nestjs/common";
import { WebApplicationController } from "./web-application.controller";
import { ApplicationModule } from "@/application/application.module";

@Module({
  controllers: [WebApplicationController],
  imports: [ApplicationModule],
})
export class WebApplicationModule {}
