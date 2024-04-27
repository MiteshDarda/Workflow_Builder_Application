import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkflowEntity } from './entities/workflow.entity';
import { DataSource, Repository } from 'typeorm';
import { NodeEntity } from './entities/node.entity';
import { EdgeEntity } from './entities/edge.entity';
@Injectable()
export class WorkflowService {
  constructor(
    @InjectRepository(WorkflowEntity)
    private readonly workflowEntity: Repository<WorkflowEntity>,
    @InjectRepository(NodeEntity)
    private readonly nodeEntity: Repository<NodeEntity>,
    @InjectRepository(EdgeEntity)
    private readonly edgeEntity: Repository<EdgeEntity>,
    private readonly dataSource: DataSource,
    // private readonly queryRunner: QueryRunner,
  ) {}

  //* Create new Workflow .
  async create(body: CreateWorkflowDto) {
    const nodeEntitys = this.createNodes(body);
    const edgeEntitys = this.createEdges(body);
    const newWorkflowEntity = new WorkflowEntity();
    newWorkflowEntity.edges = edgeEntitys;
    newWorkflowEntity.nodes = nodeEntitys;

    const queryRunner = this.dataSource.createQueryRunner();

    console.log(nodeEntitys);
    console.log(edgeEntitys);
    let workflowId = null;
    try {
      await queryRunner.startTransaction();
      await queryRunner.manager.save(nodeEntitys);
      await queryRunner.manager.save(edgeEntitys);
      workflowId = await queryRunner.manager.save(newWorkflowEntity);
      await queryRunner.commitTransaction();
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }

    return {
      id: workflowId?.id,
      message: 'Saved Successfully',
    };
  }

  //* Find all Workflows .
  async findAll() {
    const workflows = await this.workflowEntity
      .createQueryBuilder()
      .getManyAndCount();

    if (!workflows)
      throw new HttpException(
        { message: 'workflow doesnt exists' },
        HttpStatus.BAD_REQUEST,
      );

    return {
      workflowIds: workflows[0],
      total: workflows[1],
    };
  }

  //* Update Workflow .
  async update(id: number, body: CreateWorkflowDto) {
    const nodeEntitys = this.createNodes(body);
    const edgeEntitys = this.createEdges(body);
    const workflow = await this.findOne(id);
    if (!workflow)
      throw new HttpException(
        { message: 'workflow doesnt exists' },
        HttpStatus.BAD_REQUEST,
      );

    workflow.edges = edgeEntitys;
    workflow.nodes = nodeEntitys;

    const workflowId = workflow.id;

    const queryRunner = this.dataSource.createQueryRunner();
    try {
      queryRunner.startTransaction();
      queryRunner.manager.delete(NodeEntity, { workflow: workflowId });
      queryRunner.manager.delete(EdgeEntity, { workflow: workflowId });
      await queryRunner.manager.save(nodeEntitys);
      await queryRunner.manager.save(edgeEntitys);
      await queryRunner.manager.save(workflow);
      await queryRunner.commitTransaction();
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }

    return { message: 'Updated Succesfully' };
  }

  //* Run Workflow .
  async run(id: number, file: File) {
    console.log(id, file);
  }

  //$ find the workflow by id .
  async findOne(id: number) {
    return await this.workflowEntity
      .createQueryBuilder('workflow')
      .where('workflow.id = :id', { id })
      .getOne();
  }

  // $ Create node Entitys .
  createNodes(body: CreateWorkflowDto) {
    return body.nodes.map((node) => {
      const newNodeEntity = new NodeEntity();
      newNodeEntity.height = node.height;
      newNodeEntity.id = node.id;
      newNodeEntity.positionX = node?.position?.x;
      newNodeEntity.positionY = node?.position?.y;
      newNodeEntity.title = node?.data?.label;
      newNodeEntity.width = node.width;
      newNodeEntity.type = node.type;
      return newNodeEntity;
    });
  }

  // $ Create edge Entitys .
  createEdges(body: CreateWorkflowDto) {
    return body.edges.map((edge) => {
      const newEdgeEnity = new EdgeEntity();
      newEdgeEnity.id = edge.id;
      newEdgeEnity.source = edge.source;
      newEdgeEnity.target = edge.target;
      return newEdgeEnity;
    });
  }
}
