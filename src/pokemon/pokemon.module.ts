import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';

@Module({
  imports: [HttpModule, ConfigModule.forRoot()],
  providers: [PokemonService],
  controllers: [PokemonController],
})
export class PokemonModule {}
