import { Controller, Get, Param, Query } from '@nestjs/common';
import { Observable, forkJoin, switchMap } from 'rxjs';
import { PokemonService } from './pokemon.service';

@Controller('pokemon')
export class PokemonController {
  constructor(private pokemonService: PokemonService) {}

  @Get()
  getList(@Query('page') page: number): Observable<any> {
    const offset = (page - 1) * 20;
    const data = this.pokemonService.findAll(offset).pipe(
      switchMap((response) =>
        forkJoin(
          response.map((i) => {
            const url = i.url;
            // get id param by regex
            const regex = /https\:\/\/pokeapi\.co\/api\/v2\/pokemon\/(\w+)/;
            const id = regex.exec(url)[1];
            return this.pokemonService.findOne(Number.parseInt(id));
          }),
        ),
      ),
    );
    return data;
  }

  @Get(':id')
  getDetail(@Param('id') id: number): Observable<any> {
    const data = this.pokemonService.findOne(id);
    return data;
  }
}
