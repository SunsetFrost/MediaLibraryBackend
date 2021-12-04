import {
  Controller,
  Get,
  Param,
  Query,
  Header,
  StreamableFile,
} from '@nestjs/common';
import { VideoService } from './video.service';
import { Video } from './interface/video.interface';
import { ListDto } from './dto/dto';
import { Observable, map } from 'rxjs';
import { createReadStream, createWriteStream } from 'fs';
import { join } from 'path';
import { response } from 'express';

@Controller('video')
export class VideoController {
  constructor(private videoService: VideoService) {}

  @Get()
  findAll(@Query() query: ListDto): Observable<Video[]> {
    const { page } = query;
    const data = this.videoService.findPopular(page);
    return data;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.videoService.findOne(id);
  }

  @Get('image/:id')
  @Header('Content-Type', 'image/jpeg')
  getImage(@Param('id') id: string) {
    return this.videoService
      .getImage(id)
      .pipe(map((stream) => new StreamableFile(stream)));
  }
}
