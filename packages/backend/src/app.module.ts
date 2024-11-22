import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // config
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.local',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
