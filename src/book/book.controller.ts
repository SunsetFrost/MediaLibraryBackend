import {
  Controller,
  Get,
  Param,
  Query,
  Header,
  StreamableFile,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
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
      switchMap((response) => {
        if (!response) {
          throw new HttpException(
            'Book NewYork Times API return null',
            HttpStatus.FORBIDDEN,
          );
        }
        return forkJoin(
          response.map((data) => {
            const { isbns } = data;
            const { isbn13: isbn } = isbns[0] ?? {};
            return this.bookService.findOneByISBN(isbn).pipe(
              map((i) => {
                return i?.items?.[0];
              }),
            );
          }),
          (...values) => values.filter((i) => i),
        );
      }),
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

  @Get('image/:id')
  @Header('Content-Type', 'image/jpeg')
  getImage(@Param('id') id: string) {
    return this.bookService
      .getImage(id)
      .pipe(map((stream) => new StreamableFile(stream)));
  }
}
