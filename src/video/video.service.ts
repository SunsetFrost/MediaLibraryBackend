import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Video } from './interface/video.interface';
import { Observable, map } from 'rxjs';

@Injectable()
export class VideoService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    this._proxy = {
      proxy: {
        host: '127.0.0.1',
        port: 7890,
      },
    };
  }

  _proxy: AxiosRequestConfig<any>;

  findPopular(page: string): Observable<AxiosResponse<Video[]>> {
    const key = this.configService.get<string>('TMDB_API_KEY');
    const url = `https://api.themoviedb.org/3/movie/popular?page=${page}&api_key=${key}&language=zh-CN`;

    return this.httpService
      .get(url, this._proxy)
      .pipe(map((response) => response.data));
  }

  findOne(id: string): Observable<AxiosResponse<Video>> {
    const key = this.configService.get<string>('TMDB_API_KEY');
    const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${key}&language=zh-CN`;

    return this.httpService
      .get(url, this._proxy)
      .pipe(map((response) => response.data));
  }

  getImage(id: string): Observable<Buffer> {
    const url = `https://image.tmdb.org/t/p/w500/${id}.jpg`;

    return this.httpService
      .get(url, this._proxy)
      .pipe(map((response) => Buffer.from(response.data), 'utf-8'));
  }
}
