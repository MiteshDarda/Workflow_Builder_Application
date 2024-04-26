import { Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { NodeEntity } from './node.entity';
import { EdgeEntity } from './edge.entity';
import { Global } from '@nestjs/common';

@Global()
@Entity('workflow')
export class WorkflowEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => NodeEntity, (node) => node.workflow, {
    onDelete: 'SET NULL',
  })
  nodes: NodeEntity[];

  @OneToMany(() => EdgeEntity, (edge) => edge.workflow, {
    onDelete: 'SET NULL',
  })
  edges: EdgeEntity[];
}
