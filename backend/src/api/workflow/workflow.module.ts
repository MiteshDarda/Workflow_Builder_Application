import { Module } from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { WorkflowController } from './workflow.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkflowEntity } from './entities/workflow.entity';
import { NodeEntity } from './entities/node.entity';
import { EdgeEntity } from './entities/edge.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WorkflowEntity, NodeEntity, EdgeEntity])],
  controllers: [WorkflowController],
  providers: [WorkflowService],
})
export class WorkflowModule {}
