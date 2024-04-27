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
import { parse } from 'csv-parse';
import { Parser } from '@json2csv/plainjs';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

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

  sseEventsAvailable = {
    // '1': 99,
  };

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
    const workflow = await this.findOne(id);
    if (!workflow)
      throw new HttpException(
        { message: 'workflow doesnt exists' },
        HttpStatus.BAD_REQUEST,
      );
    try {
      const completeWorkflow = await this.workflowEntity
        .createQueryBuilder('workflow')
        .where('workflow.id = :id', { id })
        .leftJoinAndSelect('workflow.nodes', 'nodes')
        .leftJoinAndSelect('workflow.edges', 'edges')
        .getOne();

      return this.toGraph(completeWorkflow, file);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // $ Convert To Graph .
  async toGraph(completeWorkflow: any, file: File) {
    const nodes = {};
    completeWorkflow?.nodes?.filter((node: any) => {
      nodes[node?.id] = node?.title;
    });
    const edges = {};
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

    const time = Date.now();
    this.runGraph(graph, nodes, time, file);
    return { eventId: time };
  }

  //$ Run Graph Nodes .
  async runGraph(graph: any[], nodes: any, time: number, file: File | any) {
    this.sseEventsAvailable[time] = { completedPercentage: 1, completed: [] };

    for (const node of graph) {
      const i = graph.indexOf(node);
      const completedPercentage = ((i + 1) * 100) / graph.length;
      const latestCompleted = nodes[node];
      let fileJson = null;

      if (nodes[node] === workflowNodesConstant.START) {
        // start
      }
      if (nodes[node] === workflowNodesConstant.FILTER) {
        file = await this.csvParseLowercase(file);
        const opts = {};
        const parser = await new Parser(opts);
        file = await parser.parse(file);
        console.log('lowercase', file);
      }
      if (nodes[node] === workflowNodesConstant.CONVERT) {
        fileJson = await this.csvToJson(file);
        console.log('JSON', fileJson);
        // CSV to JSON
      }
      if (nodes[node] === workflowNodesConstant.POST) {
        if (fileJson) await this.postData(fileJson);
        else {
          const json = await this.csvToJson(file);
          await this.postData(json);
        }
        // POST Req
      }
      if (nodes[node] === workflowNodesConstant.WAIT) {
        // delay of 5s
        await this.delay(5);
      }
      if (nodes[node] === workflowNodesConstant.END) {
        // end
      }

      this.sseEventsAvailable[time]?.completed?.push(nodes[node]);
      this.sseEventsAvailable[time] = {
        ...this.sseEventsAvailable[time],
        completedPercentage,
        latestCompleted,
      };
    }
  }

  //$ Post Request .
  async postData(fileJson): Promise<void> {
    try {
      const data = JSON.stringify({
        data: fileJson,
      });

      const config: AxiosRequestConfig = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://workflow-builder.requestcatcher.com/test',
        headers: {
          'Content-Type': 'application/json',
        },
        data: data,
      };

      const response: AxiosResponse = await axios.request(config);
      console.log(JSON.stringify(response.data));
    } catch (error) {
      console.log(error);
    }
  }

  //$ Delay Function .
  async delay(s: number) {
    const ms = s * 1000;
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  //$ Each Csv Column to LowerCase .
  async csvParseLowercase(file: any): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const result = [];
      parse(file.buffer, (err, data) => {
        if (err) {
          console.error('Error parsing CSV:', err);
          reject(err);
          return;
        }
        data.forEach((row: any) => {
          Object.keys(row).forEach((key: string) => {
            row[key] = row[key].toLowerCase();
          });
          result.push(row);
        });
        resolve(result); // Resolve the promise with the modified data
      });
    });
  }

  //$ CSV to JSON .
  async csvToJson(file: any) {
    return new Promise((resolve, reject) => {
      parse(
        file,
        {
          columns: true, // Treats the first row as headers
          skip_empty_lines: true, // Skip empty lines
        },
        (err, data) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(data);
        },
      );
    });
  }

  //* SSE .
  sse(eventId: number): Observable<MessageEvent> {
    return interval(1000).pipe(
      map(() => {
        if (this.sseEventsAvailable[eventId]) {
          return {
            data: this.sseEventsAvailable[eventId],
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
