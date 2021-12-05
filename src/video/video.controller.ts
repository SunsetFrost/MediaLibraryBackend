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
import { Trailer } from './interface/trailer.interface';
import { ListDto } from './dto/dto';
import { Observable, map, filter, first, from, take, concatAll } from 'rxjs';
import * as Youtube from 'youtube-stream-url';
// import { createReadStream, createWriteStream } from 'fs';
// import { join } from 'path';

@Controller('video')
export class VideoController {
  constructor(private videoService: VideoService) {}

  @Get()
  findAll(@Query() query: ListDto): Observable<Video[]> {
    const { page = '1' } = query;
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

  @Get('trailer/:id')
  getTrailer(@Param('id') id: string) {
    // request videos
    return this.videoService.getTmdbVideos(id).pipe(
      // 提取video
      concatAll(),
      // 筛选youtube预告片
      filter((video) => video.site === 'YouTube'),
      first(),
    );
  }
}
