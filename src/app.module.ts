import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { Bucket } from './entity/bucket.entity';
import { BucketCategory } from './entity/bucket-category.entity';
import { User } from './entity/user.entity';
import { Participant } from './entity/participant.entity';
import { UserBookmark } from './entity/user-bookmark.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
        timezone: '+09:00',
        logging: true,
      }),
    }),
    TypeOrmModule.forFeature([
      Bucket,
      BucketCategory,
      User,
      Participant,
      UserBookmark,
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
