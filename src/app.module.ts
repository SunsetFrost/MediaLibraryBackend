import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { VideoModule } from './video/video.module';
import { MusicModule } from './music/music.module';
import { BookModule } from './book/book.module';
import { PokemonModule } from './pokemon/pokemon.module';
import { AnimeModule } from './anime/anime.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    VideoModule,
    MusicModule,
    BookModule,
    PokemonModule,
    AnimeModule,
  ],
})
export class AppModule {}
