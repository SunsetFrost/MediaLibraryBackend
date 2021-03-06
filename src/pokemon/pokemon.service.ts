import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig } from 'axios';
import { Observable, map, catchError } from 'rxjs';
import { Readable } from 'stream';

@Injectable()
export class PokemonService {
  constructor(private httpService: HttpService) {
    this._httpConfig = {
      // proxy: {
      //   host: '127.0.0.1',
      //   port: 7890,
      // },
    };
  }

  _httpConfig: AxiosRequestConfig<any>;

  findAll(offset: number): Observable<any> {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}`;
    return this.httpService.get(url, this._httpConfig).pipe(
      map((res) => {
        return res.data.results;
      }),
      catchError((e) => {
        throw new HttpException(e.response.data, e.response.status);
      }),
    );
  }

  findOne(id: number): Observable<any> {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    return this.httpService.get(url, this._httpConfig).pipe(
      map((res) => res.data),
      catchError((e) => {
        throw new HttpException(e.response.data, e.response.status);
      }),
    );
  }

  getImage(id: string): Observable<Readable> {
    const url = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif
    `;
    this._httpConfig.responseType = 'stream';

    return this.httpService.get(url, this._httpConfig).pipe(
      map((res) => res.data),
      catchError((e) => {
        throw new HttpException(e.response.data, e.response.status);
      }),
    );
  }
}
