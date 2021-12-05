import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig } from 'axios';
import { Observable, map } from 'rxjs';
import { Video } from './interface/video.interface';
import { Trailer } from './interface/trailer.interface';
import { Readable } from 'stream';

@Injectable()
export class VideoService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    this._httpConfig = {
      proxy: {
        host: '127.0.0.1',
        port: 7890,
      },
    };
    this._key = this.configService.get<string>('TMDB_API_KEY');
  }

  _httpConfig: AxiosRequestConfig<any>;
  _key: string;

  findPopular(page: string): Observable<Video[]> {
    const url = `https://api.themoviedb.org/3/movie/popular?page=${page}&api_key=${this._key}&language=zh-CN`;

    return this.httpService
      .get(url, this._httpConfig)
      .pipe(map((res) => res.data));
  }

  findOne(id: string): Observable<Video> {
    const key = this.configService.get<string>('TMDB_API_KEY');
    const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${this._key}&language=zh-CN`;

    return this.httpService
      .get(url, this._httpConfig)
      .pipe(map((res) => res.data));
  }

  getImage(id: string): Observable<Readable> {
    const url = `https://image.tmdb.org/t/p/w500/${id}.jpg`;
    this._httpConfig.responseType = 'stream';

    return this.httpService
      .get(url, this._httpConfig)
      .pipe(map((res) => res.data));
  }

  getTmdbVideos(id: string): Observable<Trailer[]> {
    const url = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${this._key}`;
    return this.httpService
      .get(url, this._httpConfig)
      .pipe(map((res) => res.data.results));
  }
}
