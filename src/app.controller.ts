import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('search')
  search(@Query('search') searchTerm?: string) {
    return this.appService.search(searchTerm);
  }

  @Get('/bucket-list')
  getBucketList(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
  ) {
    return this.appService.getBucketList(limit, offset);
  }

  @Get('bucket-list/:bucketId')
  async getBucketListById(@Param('bucketId', ParseIntPipe) bucketId: number) {
    return this.appService.getBucketListById(bucketId);
  }
}
