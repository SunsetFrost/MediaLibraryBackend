import { Controller, Get, HttpException, Param, Query } from '@nestjs/common';
import { concatAll, map, Observable, catchError } from 'rxjs';
import { MusicService } from './music.service';

@Controller('music')
export class MusicController {
  constructor(private musicService: MusicService) {}

  @Get('new-releases')
  getNewReleases(@Query('page') page: number): Observable<any> {
    const data = this.musicService.getAuth().pipe(
      map((res) => res.data),
      // use auth to request api info
      map((data) => {
        const auth = `${data.token_type} ${data.access_token}`;
        return this.musicService.getNewReleases(page, auth);
      }),
      concatAll(),
      // api res to data
      map((res) => res.data),
      catchError((e) => {
        throw new HttpException(e.response.data, e.response.status);
      }),
    );

    return data;
  }

  @Get('search')
  searchAlbum(
    @Query('page') page: number,
    @Query('query') query: string,
  ): Observable<any> {
    const data = this.musicService.getAuth().pipe(
      map((res) => res.data),
      // use auth to request api info
      map((data) => {
        const auth = `${data.token_type} ${data.access_token}`;
        return this.musicService.searchAlbum(query, page, auth);
      }),
      concatAll(),
      // api res to data
      map((res) => res.data),
      catchError((e) => {
        throw new HttpException(e.response.data, e.response.status);
      }),
    );

    return data;
  }

  @Get(':id')
  getDetail(@Param('id') id: string) {
    const data = this.musicService.getAuth().pipe(
      map((res) => res.data),
      // use auth to request api info
      map((data) => {
        const auth = `${data.token_type} ${data.access_token}`;
        return this.musicService.getDetail(id, auth);
      }),
      concatAll(),
      // api res to data
      map((res) => res.data),
      catchError((e) => {
        throw new HttpException(e.response.data, e.response.status);
      }),
    );

    return data;
  }
}
