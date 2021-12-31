import { Controller, Get, Param, Query } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { AnimeService } from './anime.service';

@Controller('anime')
export class AnimeController {
  constructor(private animeService: AnimeService) {}

  @Get()
  getAll(@Query('page') page: number): Observable<any> {
    const perpage = 20;
    const data = this.animeService
      .findAll(page, perpage)
      .pipe(map((res) => res?.data?.Page?.media));
    return data;
  }

  @Get(':id')
  getById(@Param('id') id: string): Observable<any> {
    const data = this.animeService
      .findOne(id)
      .pipe(map((res) => res?.data?.Media));
    return data;
  }
}
