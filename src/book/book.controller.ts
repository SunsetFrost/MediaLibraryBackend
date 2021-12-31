import { Controller, Get, Param, Query } from '@nestjs/common';
import { response } from 'express';
import {
  filter,
  forkJoin,
  map,
  // concatAll,
  // concatMap,
  // filter,
  // first,
  // from,
  // map,
  // merge,
  // mergeAll,
  // mergeMap,
  Observable,
  switchMap,
  tap,
  // reduce,
  // startWith,
} from 'rxjs';
import { BookService } from './book.service';

@Controller('book')
export class BookController {
  constructor(private bookService: BookService) {}

  @Get('best-sellers')
  getBestSellers(@Query('page') page: number) {
    const apiPage = (page - 1) * 20;
    const data = this.bookService.getBestSellers(apiPage).pipe(
      switchMap((response) =>
        forkJoin(
          response.map((data) => {
            const { isbns } = data;
            const { isbn13: isbn } = isbns[0] ?? {};
            return this.bookService
              .findOneByISBN(isbn)
              .pipe(map((i) => i?.items?.[0]));
          }),
        ),
      ),
      tap(console.log),
    );

    return data;
  }

  @Get('search')
  search(
    @Query('query') title: string,
    @Query('page') page: number,
  ): Observable<any> {
    const maxResults = 20;
    let startIndex = 0;
    if (Number.isInteger(page)) {
      startIndex = page === 1 ? 0 : (page - 1) * maxResults;
    }
    return this.bookService.findAll(title, startIndex, maxResults);
  }

  @Get('volumes/:id')
  getDetail(@Param('id') id: string): Observable<any> {
    const data = this.bookService.findOne(id);
    return data;
  }
}
