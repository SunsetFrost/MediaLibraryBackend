import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { MusicController } from './music.controller';
import { MusicService } from './music.service';

@Module({
  imports: [HttpModule, ConfigModule.forRoot()],
  controllers: [MusicController],
  providers: [MusicService],
})
export class MusicModule {}
