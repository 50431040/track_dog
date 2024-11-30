import { Module } from "@nestjs/common";
import { ApplicationService } from "./application.service";
import { ApplicationRepository } from "@/schema/application.schema";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  providers: [ApplicationService],
  imports: [TypeOrmModule.forFeature([ApplicationRepository])],
})
export class ApplicationModule {}
