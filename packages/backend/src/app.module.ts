import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RedisModule } from "@liaoliaots/nestjs-redis";
import { BullModule } from "@nestjs/bull";
import { APP_FILTER } from "@nestjs/core";
import { AllExceptionsFilter } from "./base/filter/all.filter";
import { WebUserModule } from "./web-user/web-user.module";
import { AuthModule } from "./auth/auth.module";
import { ApplicationModule } from "./application/application.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WebUserRepository } from "./schema/web-user.schema";
import { WebApplicationModule } from "./web-application/web-application.module";
import { ApplicationRepository } from "./schema/application.schema";

@Module({
  imports: [
    // config
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === "production" ? ".env.prod" : ".env.local",
    }),
    // Redis
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        config: {
          host: configService.get("REDIS_HOST"),
          port: parseInt(configService.get("REDIS_PORT"), 10),
          password: configService.get("REDIS_PASSWORD"),
        },
      }),
    }),
    // 队列
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get("REDIS_HOST"),
          port: parseInt(configService.get("REDIS_PORT"), 10),
          password: configService.get("REDIS_PASSWORD"),
        },
      }),
    }),
    // 数据库
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "mongodb",
        url: `mongodb://${configService.get<string>("MONGODB_USER")}:${configService.get<string>("MONGODB_PASS")}@${configService.get<string>("MONGODB_HOST")}:${configService.get<string>("MONGODB_PORT")}/`,
        database: "track_dog",
        authSource: "admin",
        entities: [WebUserRepository, ApplicationRepository],
        synchronize: false,
        logging: process.env.NODE_ENV !== "production",
      }),
    }),
    // MongoDB
    // MongooseModule.forRootAsync({
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => ({
    //     uri: `mongodb://${configService.get<string>("MONGODB_URL")}/`,
    //     user: configService.get<string>("MONGODB_USER"),
    //     pass: configService.get<string>("MONGODB_PASS"),
    //     dbName: configService.get<string>("MONGODB_DB_NAME"),
    //   }),
    // }),
    WebUserModule,
    AuthModule,
    ApplicationModule,
    WebApplicationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
