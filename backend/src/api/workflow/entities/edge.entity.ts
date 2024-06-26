import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';
import { WorkflowEntity } from './workflow.entity';

@Entity('edge')
export class EdgeEntity {
  @PrimaryColumn({ type: 'varchar', length: '250' })
  id: string;

  @Column({ type: 'varchar', length: '250' })
  source: string;

  @Column({ type: 'varchar', length: '250' })
  target: string;

  @ManyToOne(() => WorkflowEntity, (workflow) => workflow.edges, {
    nullable: true,
  })
  workflow: WorkflowEntity;
}
