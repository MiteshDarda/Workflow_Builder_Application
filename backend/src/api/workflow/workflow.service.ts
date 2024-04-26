import { Injectable } from '@nestjs/common';
@Injectable()
export class WorkflowService {
  create() {
    return 'This action adds a new workflow';
  }

  findAll() {
    return `This action returns all workflow`;
  }

  findOne(id: number) {
    return `This action returns a #${id} workflow`;
  }

  update(id: number) {
    return `This action updates a #${id} workflow`;
  }

  remove(id: number) {
    return `This action removes a #${id} workflow`;
  }
}
