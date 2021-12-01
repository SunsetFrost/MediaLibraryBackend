import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';

@Module({
  imports: [HttpModule, ConfigModule.forRoot()],
  providers: [VideoService],
  controllers: [VideoController],
})
export class VideoModule {}
