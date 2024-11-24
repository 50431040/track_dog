import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "../constants/jwt";
import { WebUser, WebUserSchema } from "../schema/web-user";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./auth.guard";
import { JwtStrategy } from "./jwt.strategy";
import { PassportModule } from "@nestjs/passport";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "30d" },
    }),
    MongooseModule.forFeature([{ name: WebUser.name, schema: WebUserSchema }]),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
