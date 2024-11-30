import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "../constants/jwt";
import { WebUserRepository } from "../schema/web-user.schema";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./auth.guard";
import { JwtStrategy } from "./jwt.strategy";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "30d" },
    }),
    TypeOrmModule.forFeature([WebUserRepository]),
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
