import { Module } from "@nestjs/common";
import { WebUserController } from "./web-user.controller";
import { WebUserService } from "./web-user.service";
import { WebUser, WebUserSchema } from "src/schema/web-user";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: WebUser.name, schema: WebUserSchema }]),
    AuthModule,
  ],
  controllers: [WebUserController],
  providers: [WebUserService],
})
export class WebUserModule {}
