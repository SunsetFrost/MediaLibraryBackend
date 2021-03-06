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
import { ListDto, SearchDto } from './dto/dto';
import {
  Observable,
  map,
  filter,
  concatAll,
  tap,
  forkJoin,
  mergeAll,
  from,
} from 'rxjs';

@Controller('video')
export class VideoController {
  constructor(private videoService: VideoService) {}

  @Get()
  findAll(@Query() query: ListDto): Observable<Video[]> {
    const { sort_by = 'popularity.desc', page = '1', type = 'All' } = query;
    const data = this.videoService.findAll(sort_by, type, page);
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
    // const data = this.videoService.getTmdbVideos(id);
    const data = this.videoService.getTmdbVideos(id).pipe(
      // 提取video
      concatAll(),
      // 筛选youtube预告片
      filter(
        (video) =>
          video.site === 'YouTube' &&
          video.official === true &&
          video.type === 'Trailer',
      ),
    );

    return forkJoin(data);
  }
  @Get('search/movie')
  searchMovie(@Query() query: SearchDto): Observable<any> {
    const { text, page = 1 } = query;
    const data = this.videoService.searchMovies(text, page);
    return data;
  }
}
