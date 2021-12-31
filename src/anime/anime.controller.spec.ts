import { Test, TestingModule } from '@nestjs/testing';
import { AnimeController } from './anime.controller';

describe('AnimeController', () => {
  let controller: AnimeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnimeController],
    }).compile();

    controller = module.get<AnimeController>(AnimeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
