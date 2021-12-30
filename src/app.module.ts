import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VideoModule } from './video/video.module';
import { MusicModule } from './music/music.module';
import { BookModule } from './book/book.module';
import { PokemonModule } from './pokemon/pokemon.module';

@Module({
  imports: [ConfigModule.forRoot(), VideoModule, MusicModule, BookModule, PokemonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
