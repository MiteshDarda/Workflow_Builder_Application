import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkflowEntity } from './entities/workflow.entity';
import { DataSource, Repository } from 'typeorm';
import { NodeEntity } from './entities/node.entity';
import { EdgeEntity } from './entities/edge.entity';
import { workflowNodesConstant } from 'src/common/constants/workflow-node-constants';
import { Observable, interval, map } from 'rxjs';
import { MessageEvent } from './workflow.controller';
import { start_node } from './nodes/start_node';

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
  ) {}

  //$ Track of sse in progress .
  sseAvailable = {};

  //* Create new Workflow .
  async create(body: CreateWorkflowDto) {
    const nodeEntitys = this.createNodes(body);
    const edgeEntitys = this.createEdges(body);
    const newWorkflowEntity = new WorkflowEntity();
    newWorkflowEntity.edges = edgeEntitys;
    newWorkflowEntity.nodes = nodeEntitys;

    const queryRunner = this.dataSource.createQueryRunner();
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
      await queryRunner.manager.delete(NodeEntity, { workflow: workflowId });
      await queryRunner.manager.delete(EdgeEntity, { workflow: workflowId });
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
    try {
      const workflow = await this.findOne(id);
      if (!workflow)
        throw new HttpException(
          { message: 'workflow doesnt exists' },
          HttpStatus.BAD_REQUEST,
        );
      const completeWorkflow = await this.workflowEntity
        .createQueryBuilder('workflow')
        .where('workflow.id = :id', { id })
        .leftJoinAndSelect('workflow.nodes', 'nodes')
        .leftJoinAndSelect('workflow.edges', 'edges')
        .getOne();

      return await this.toGraph(completeWorkflow, file);
    } catch (error) {
      console.log('>>>', error);
      throw error;
    }
  }

  // $ Convert To Graph Run Workflow Helper .
  async toGraph(completeWorkflow: any, file: File) {
    try {
      const nodes = {};
      completeWorkflow?.nodes?.filter((node: any) => {
        nodes[node?.id] = node?.title;
      });
      const edges = {};
      // from -> to
      completeWorkflow?.edges?.filter((edge: any) => {
        edges[edge?.source] = edge?.target;
      });
      const [startNode] = completeWorkflow?.nodes.filter((node: any) => {
        return node.title === workflowNodesConstant.START;
      });

      const graph = [];
      let nodeI = startNode.id;
      while (nodeI) {
        graph.push(nodeI);
        nodeI = edges[nodeI];
      }

      if (
        !startNode ||
        nodes[graph[graph.length - 1]] !== workflowNodesConstant.END
      )
        throw new HttpException(
          'Workflow Do not have proper Start and End Node',
          HttpStatus.NOT_ACCEPTABLE,
        );

      const eventId = Date.now();
      this.runGraph(graph, nodes, eventId, file);
      return { eventId };
    } catch (error) {
      throw error;
    }
  }

  //$ Run Graph Nodes Run Workflow Helper .
  async runGraph(graph: any[], nodes: any, eventId: number, file: File | any) {
    try {
      this.sseAvailable[eventId] = {
        completedPercentage: 1,
        completed: [],
        error: false,
        errorMessage: '',
      };

      graph = graph.map((node) => nodes[node]);

      const req = {
        eventId,
        file,
        graph,
        currentNodeIndex: 0,
        eventProgress: this.sseAvailable[eventId],
      };
      const res = {};
      return await start_node(res, req, graph[1]);
    } catch (error) {
      // throw error;
      this.sseAvailable[eventId].error = true;
      this.sseAvailable[eventId].errorMessage = error;
      console.log(error);
    }
  }

  //* SSE .
  sse(eventId: number): Observable<MessageEvent> {
    return interval(1000).pipe(
      map(() => {
        if (this.sseAvailable[eventId]) {
          if (this.sseAvailable[eventId].error) {
            return {
              data: this.sseAvailable[eventId],
              type: 'error',
            } as MessageEvent;
          } else
            return {
              data: this.sseAvailable[eventId],
              type: '',
            } as MessageEvent;
        } else
          return { data: { hello: 'world' }, type: 'close' } as MessageEvent;
      }),
    );
  }

  //$ find the workflow by id .
  async findOne(id: number) {
    return await this.workflowEntity
      .createQueryBuilder('workflow')
      .where('workflow.id = :id', { id })
      .getOne();
  }

  // $ Create node Entites .
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

  // $ Create edge Entites .
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
