import { Controller, Get, Param, Query } from '@nestjs/common';
import { title } from 'process';
import { map, Observable, startWith } from 'rxjs';
import { BookService } from './book.service';

@Controller('book')
export class BookController {
  constructor(private bookService: BookService) {}

  @Get('best-sellers')
  getBestSellers(@Query() page: string): Observable<any> {
    const data = this.bookService.getBestSellers(page);
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

  @Get(':id')
  getDetail(@Param() id: string): Observable<any> {
    const data = this.bookService.findOne(id);
    return data;
  }
}
