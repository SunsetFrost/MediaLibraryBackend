import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig } from 'axios';
import { Observable } from 'rxjs';
import * as qs from 'qs';

@Injectable()
export class MusicService {
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
    this._clientID = this.configService.get<string>('SPOTIFY_CLIENTID');
    this._clientSecret = this.configService.get<string>('SPOTIFY_CLIENTSECRET');
  }

  _httpConfig: AxiosRequestConfig<any>;
  _clientID: string;
  _clientSecret: string;

  getAuth(): Observable<any> {
    const url = 'https://accounts.spotify.com/api/token';
    const reqData = {
      grant_type: 'client_credentials',
    };
    const config = {
      ...this._httpConfig,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      auth: {
        username: this._clientID,
        password: this._clientSecret,
      },
    };
    return this.httpService.post(url, qs.stringify(reqData), config);
  }

  getNewReleases(page: number, auth: string): Observable<any> {
    const url = `https://api.spotify.com/v1/browse/new-releases?offset=${page}`;
    const config = {
      ...this._httpConfig,
      headers: {
        Authorization: auth,
        'Content-Type': 'application/json',
      },
    };
    return this.httpService.get(url, config);
  }

  searchAlbum(query: string, page: number, auth: string): Observable<any> {
    const url = `https://api.spotify.com/v1/search?type=album&include_external=audio&q=${query}&offset=${page}`;
    const config = {
      ...this._httpConfig,
      headers: {
        Authorization: auth,
      },
    };
    return this.httpService.get(url, config);
  }

  getDetail(id: string, auth: string): Observable<any> {
    const url = `https://api.spotify.com/v1/albums/${id}/tracks`;
    const config = {
      ...this._httpConfig,
      headers: {
        Authorization: auth,
      },
    };
    return this.httpService.get(url, config);
  }
}
