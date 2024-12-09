import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CreateBucketDto } from './dto/create.bucket.dto';

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

  @Post('/bucket-list/create')
  async createBucket(@Body() createBucketDto: CreateBucketDto) {
    try {
      const result = await this.appService.createBucket(createBucketDto);
      return {
        success: true,
        message: 'Bucket created successfully',
        data: result,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
