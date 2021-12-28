import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { BookService } from './book.service';
import { BookController } from './book.controller';

@Module({
  imports: [HttpModule, ConfigModule.forRoot()],
  providers: [BookService],
  controllers: [BookController],
})
export class BookModule {}
