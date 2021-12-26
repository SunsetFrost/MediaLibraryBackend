import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VideoModule } from './video/video.module';
import { MusicModule } from './music/music.module';

@Module({
  imports: [ConfigModule.forRoot(), VideoModule, MusicModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
