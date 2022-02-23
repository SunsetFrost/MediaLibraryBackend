import {
  Controller,
  Get,
  Header,
  Param,
  Query,
  StreamableFile,
} from '@nestjs/common';
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
            const url = i.url;
            const regex = /https\:\/\/pokeapi\.co\/api\/v2\/pokemon\/(\w+)/;
            const id = regex.exec(url)[1];
            return this.pokemonService.findOne(Number.parseInt(id));
          }),
        );
      }),
      /// refactor result
      map((pokemons: any[]) =>
        pokemons.map((pokemon) => this._toSimplePokemon(pokemon)),
      ),
    );
    return data;
  }

  @Get(':id')
  getDetail(@Param('id') id: number): Observable<any> {
    const data = this.pokemonService
      .findOne(id)
      .pipe(map((pokemon) => this._toSimplePokemon(pokemon)));
    return data;
  }

  _toSimplePokemon(pokemon: any): any {
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
  }

  @Get('image/:id')
  @Header('Content-Type', 'image/jpeg')
  getImage(@Param('id') id: string) {
    return this.pokemonService
      .getImage(id)
      .pipe(map((stream) => new StreamableFile(stream)));
  }
}
