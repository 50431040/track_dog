import { Module } from "@nestjs/common";
import { WebUserController } from "./web-user.controller";
import { WebUserService } from "./web-user.service";
import { WebUserRepository } from "@/schema/web-user.schema";
import { AuthModule } from "@/auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([WebUserRepository]), AuthModule],
  controllers: [WebUserController],
  providers: [WebUserService],
})
export class WebUserModule {}
