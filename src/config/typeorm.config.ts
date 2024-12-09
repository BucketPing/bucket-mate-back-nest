import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Bucket } from 'src/entity/bucket.entity';
import { Participant } from 'src/entity/participant.entity';
import { User } from 'src/entity/user.entity';

const entityArray = [Bucket, Participant, User];

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: entityArray,
  synchronize: true,
  timezone: '+09:00',
  logging: true,
};
