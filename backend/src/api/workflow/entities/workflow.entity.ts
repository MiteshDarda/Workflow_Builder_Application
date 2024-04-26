import { Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { NodeEntity } from './node.entity';
import { EdgeEntity } from './edge.entity';
import { Global } from '@nestjs/common';

@Global()
@Entity()
export class WorkflowEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => NodeEntity, (node) => node.workflow)
  nodes: NodeEntity[];

  @OneToMany(() => EdgeEntity, (edge) => edge.workflow)
  edges: EdgeEntity[];
}
