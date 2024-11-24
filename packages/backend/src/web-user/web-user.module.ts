import { Module } from "@nestjs/common";
import { WebUserController } from "./web-user.controller";
import { WebUserService } from "./web-user.service";
import { WebUser, WebUserSchema } from "src/entity/web-user";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: WebUser.name, schema: WebUserSchema }]),
  ],
  controllers: [WebUserController],
  providers: [WebUserService],
})
export class WebUserModule {}
