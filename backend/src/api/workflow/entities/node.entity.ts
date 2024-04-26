import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';
import { WorkflowEntity } from './workflow.entity';

@Entity()
export class NodeEntity {
  @PrimaryColumn({ type: 'varchar', length: 250 })
  id: string;

  @Column({ type: 'varchar', length: 250, nullable: true })
  type: string;

  @Column({ type: 'varchar', length: 250 })
  title: string;

  @Column({ type: 'int' })
  width: number;

  @Column({ type: 'int' })
  height: number;

  @Column({ type: 'varchar', length: 250, nullable: true })
  positionX: string;

  @Column({ type: 'varchar', length: 250, nullable: true })
  positionY: string;

  @ManyToOne(() => WorkflowEntity, (workflow) => workflow.nodes)
  workflow: WorkflowEntity;
}
