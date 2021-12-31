import { Injectable, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig } from 'axios';
import { Observable, map, catchError } from 'rxjs';
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

  findAll(sort_by: string, type: string, page: string): Observable<Video[]> {
    let url = `https://api.themoviedb.org/3/discover/movie?page=${page}&sort_by=${sort_by}&api_key=${this._key}`;

    if (type === 'R') {
      url += '&certification_country=US&certification=R&include_adult=true';
    } else if (type === 'NC-17') {
      url += '&certification_country=US&certification=NC-17&include_adult=true';
    }

    return this.httpService.get(url, this._httpConfig).pipe(
      map((res) => res.data),
      catchError((e) => {
        throw new HttpException(e.response.data, e.response.status);
      }),
    );
  }

  findOne(id: string): Observable<Video> {
    const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${this._key}&language=zh-CN`;

    return this.httpService.get(url, this._httpConfig).pipe(
      map((res) => res.data),
      catchError((e) => {
        throw new HttpException(e.response.data, e.response.status);
      }),
    );
  }

  getImage(id: string): Observable<Readable> {
    const url = `https://image.tmdb.org/t/p/w500/${id}.jpg`;
    this._httpConfig.responseType = 'stream';

    return this.httpService.get(url, this._httpConfig).pipe(
      map((res) => res.data),
      catchError((e) => {
        throw new HttpException(e.response.data, e.response.status);
      }),
    );
  }

  getTmdbVideos(id: string): Observable<Trailer[]> {
    const url = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${this._key}`;
    return this.httpService.get(url, this._httpConfig).pipe(
      map((res) => res.data.results),
      catchError((e) => {
        throw new HttpException(e.response.data, e.response.status);
      }),
    );
  }

  searchMovies(query: string, page: number): Observable<Trailer[]> {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${this._key}&query=${query}&page=${page}`;
    return this.httpService.get(url, this._httpConfig).pipe(
      map((res) => res.data.results),
      catchError((e) => {
        throw new HttpException(e.response.data, e.response.status);
      }),
    );
  }
}
