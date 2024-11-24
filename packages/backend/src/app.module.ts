import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RedisModule } from "@liaoliaots/nestjs-redis";
import { BullModule } from "@nestjs/bull";
import { MongooseModule } from "@nestjs/mongoose";
import { APP_FILTER } from "@nestjs/core";
import { AllExceptionsFilter } from "./base/filter/all.filter";
// import { TypeOrmModule } from '@nestjs/typeorm';
import { WebUserModule } from "./web-user/web-user.module";

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
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => ({
    //     type: 'mysql',
    //     host: configService.get('DATABASE_HOST'),
    //     port: configService.get('DATABASE_PORT'),
    //     username: configService.get('DATABASE_USERNAME'),
    //     password: configService.get('DATABASE_PASSWORD'),
    //     database: configService.get('DATABASE_NAME'),
    //     entities: ['./**/*.entity.js'],
    //     synchronize: false,
    //     logging: process.env.NODE_ENV !== 'production',
    //   }),
    // }),
    // MongoDB
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: `mongodb://${configService.get<string>("MONGODB_URL")}/`,
        user: configService.get<string>("MONGODB_USER"),
        pass: configService.get<string>("MONGODB_PASS"),
        dbName: configService.get<string>("MONGODB_DB_NAME"),
      }),
    }),
    WebUserModule,
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
