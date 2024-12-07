import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api')
export class SearchController {
  constructor(private readonly AppService: AppService) {}

  //const response = await fetch('http://localhost:3000/api/search?searchTerm=아침');
  @Get('search')
  async search(@Query('searchTerm') searchTerm: string) {
    return this.AppService.search(searchTerm);
  }
}
