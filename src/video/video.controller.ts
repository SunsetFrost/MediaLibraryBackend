import { Controller, Get, Param, Query } from '@nestjs/common';
import { VideoService } from './video.service';
import { Video } from './interface/video.interface';
import { ListDto } from './dto/dto';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';

@Controller('video')
export class VideoController {
  constructor(private videoService: VideoService) {}

  @Get()
  findAll(@Query() query: ListDto): Observable<AxiosResponse<Video[]>> {
    const { page } = query;
    return this.videoService.findPopular(page);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.videoService.findOne(id);
  }

  @Get('image/:id')
  getImage(@Param('id') id: string) {
    return this.getImage(id);
  }
}
