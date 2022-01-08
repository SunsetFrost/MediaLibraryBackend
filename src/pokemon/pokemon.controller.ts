import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  Observable,
  forkJoin,
  concatMap,
  switchMap,
  mergeMap,
  map,
} from 'rxjs';
import { PokemonService } from './pokemon.service';

@Controller('pokemon')
export class PokemonController {
  constructor(private pokemonService: PokemonService) {}

  @Get()
  getList(@Query('page') page: number): Observable<any> {
    const offset = (page - 1) * 20;
    const data = this.pokemonService.findAll(offset).pipe(
      /// get pokemon list
      /// then use id in list to get pokemon detail
      /// use switchMap to request parallel
      /// use forkjoin to wait for last request complete
      switchMap((response) => {
        return forkJoin(
          response.map((i) => {
            // console.log(i);
            const url = i.url;
            // get id param by regex
            const regex = /https\:\/\/pokeapi\.co\/api\/v2\/pokemon\/(\w+)/;
            const id = regex.exec(url)[1];
            return this.pokemonService.findOne(Number.parseInt(id));
          }),
        );
      }),
      /// refactor result
      map((pokemons: any[]) => {
        const refactoredPokemons = pokemons.map((pokemon) => {
          const { types, stats } = pokemon;
          const newTypes = types.map((type) => {
            return {
              name: type.type.name,
              url: type.type.url,
            };
          });
          const newStats = stats.map((stat) => {
            return {
              ...stat,
              name: stat.stat.name,
            };
          });
          return {
            ...pokemon,
            types: newTypes,
            stats: newStats,
          };
        });
        return refactoredPokemons;
      }),
    );
    return data;
  }

  @Get(':id')
  getDetail(@Param('id') id: number): Observable<any> {
    const data = this.pokemonService.findOne(id);
    return data;
  }
}
