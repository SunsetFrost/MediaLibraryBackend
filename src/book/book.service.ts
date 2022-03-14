import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig } from 'axios';
import { Observable, map, catchError, tap } from 'rxjs';
import { Readable } from 'stream';

@Injectable()
export class BookService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    this._httpConfig = {
      // proxy: {
      //   host: '127.0.0.1',
      //   port: 7890,
      // },
    };
    this._ny_key = this.configService.get<string>('NYTIMES_API_KEY');
    this._google_key = this.configService.get<string>('GOOGLE_BOOK_API_KEY');
  }

  _httpConfig: AxiosRequestConfig<any>;
  _ny_key: string;
  _google_key: string;

  getBestSellers(page: number): Observable<any> {
    const url = `https://api.nytimes.com/svc/books/v3/lists/best-sellers/history.json?api-key=${this._ny_key}&offset=${page}`;
    return this.httpService.get(url, this._httpConfig).pipe(
      map((res) => {
        if (res.status == 200) {
          return res.data.results;
        } else {
          throw new HttpException(
            'best seller api wrong',
            HttpStatus.NOT_FOUND,
          );
        }
      }),
      catchError((e) => {
        throw new HttpException(e.response.data, e.response.status);
      }),
    );
  }

  findAll(
    query: string,
    startIndex: number,
    maxResults: number,
  ): Observable<any> {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${this._google_key}&startIndex=${startIndex}&maxResults=${maxResults}`;
    return this.httpService.get(url, this._httpConfig).pipe(
      map((res) => {
        if (!Array.isArray(res.data.items) || res.data.items.lenght <= 0) {
          throw new HttpException('search result empty', 200);
        }
        return res.data.items;
      }),
      catchError((e) => {
        throw new HttpException(e.response.data, e.response.status);
      }),
    );
  }

  findOne(id: string) {
    const url = `https://www.googleapis.com/books/v1/volumes/${id}?key=${this._google_key}`;
    return this.httpService.get(url, this._httpConfig).pipe(
      map((res) => res.data),
      catchError((e) => {
        throw new HttpException(e.response.data, e.response.status);
      }),
    );
  }

  findOneByISBN(isbn: string) {
    const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;
    return this.httpService.get(url, this._httpConfig).pipe(
      map((res) => res.data),
      catchError((e) => {
        throw new HttpException(e.response.data, e.response.status);
      }),
    );
  }

  getImage(id: string): Observable<Readable> {
    const url = `http://books.google.com/books/content?id=${id}&printsec=frontcover&img=1&zoom=5&source=gbs_api`;
    this._httpConfig.responseType = 'stream';

    return this.httpService.get(url, this._httpConfig).pipe(
      map((res) => res.data),
      catchError((e) => {
        throw new HttpException(e.response.data, e.response.status);
      }),
    );
  }
}
