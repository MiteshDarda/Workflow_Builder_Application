import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { allEntities } from 'src/database/all-entities';
import { DataSource } from 'typeorm';

config();

const configService = new ConfigService();

const datasource = new DataSource({
  type: 'mysql',
  host: configService.getOrThrow('DB_HOST'),
  port: Number(configService.getOrThrow('DB_PORT')),
  username: configService.getOrThrow('DB_USER'),
  password: configService.getOrThrow('DB_PASS'),
  database: configService.getOrThrow('DB_DB'),
  entities: allEntities,
  migrations: ['src/migrations/*{.ts,.js}'],
  migrationsTableName: 'typeorm_migration_table',
});

export default datasource;
