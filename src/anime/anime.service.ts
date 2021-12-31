import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig } from 'axios';
import { Observable, map, catchError } from 'rxjs';
import * as qs from 'qs';

@Injectable()
export class AnimeService {
  constructor(private httpService: HttpService) {
    this._httpConfig = {
      proxy: {
        host: '127.0.0.1',
        port: 7890,
      },
    };
  }

  _httpConfig: AxiosRequestConfig<any>;

  findAll(page: number, perpage: number): Observable<any> {
    const query = `
    query($page: Int, $perpage: Int) {
      Page(page: $page, perPage: $perpage) {
        media(type: ANIME) {
          id
          title {
            romaji
            english
            native
          }
          source
          episodes
          seasonYear
          season
          description
          isAdult
          genres
          coverImage {
            large
            medium
            color
          }
          bannerImage
        }
      }
    }
    `;
    const variables = {
      page,
      perpage,
    };
    return this._fetchAnilist(query, variables);
  }

  findOne(id: string): Observable<any> {
    const query = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        id
        title {
          romaji
          english
          native
        }
        source
        episodes
        seasonYear
        season
        description
        isAdult
        genres
        coverImage {
          large
          medium
          color
        }
        bannerImage
      }
    }
    `;

    const variables = {
      id,
    };
    return this._fetchAnilist(query, variables);
  }

  _fetchAnilist(query: string, variables: any): Observable<any> {
    const url = 'https://graphql.anilist.co';
    const data = {
      query,
      variables,
    };
    return this.httpService
      .post(url, qs.stringify(data), this._httpConfig)
      .pipe(
        map((res) => res.data),
        catchError((e) => {
          throw new HttpException(e.response.data, e.response.status);
        }),
      );
  }
}
