import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const entityArray = [];

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
