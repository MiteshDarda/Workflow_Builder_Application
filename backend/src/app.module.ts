import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './database/database.module';
import { allEntities } from './database/all-entities';
import { WorkflowModule } from './api/workflow/workflow.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    TypeOrmModule.forFeature(allEntities),
    WorkflowModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [TypeOrmModule.forFeature(allEntities)],
})
export class AppModule {}
