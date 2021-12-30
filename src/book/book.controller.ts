import { Controller, Get, Param, Query } from '@nestjs/common';
import {
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
    const data = this.bookService.getBestSellers(apiPage);

    // const data = this.bookService.getBestSellers(apiPage).pipe(
    //   // high order to first order
    //   concatAll(),
    //   // map ny api's book isbn to google api object
    //   map((data) => {
    //     const { isbns } = data;
    //     const { isbn13: isbn } = isbns[0] ?? {};
    //     return isbn;
    //   }),
    //   // reduce((acc, value) => [...acc, ...value], []),
    // );

    // TODO 每个再通过google api请求太慢了，暂时只使用new york book的
    // const googleData = data.pipe(
    //   map((isbn) => {
    //     console.log('isbn', isbn);
    //     const maxResults = 20,
    //       startIndex = apiPage;
    //     // if (!isbn) {
    //     //   return {};
    //     // }
    //     const res = this.bookService
    //       .findAll(`isbn:${isbn}`, startIndex, maxResults)
    //       .pipe(
    //         map((res) => {
    //           console.log('page', startIndex, maxResults);
    //           console.log('res data', res);
    //           return res;
    //         }),
    //         // concatAll(),
    //       );
    //     return res;
    //   }),
    //   concatAll(),
    // );
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
