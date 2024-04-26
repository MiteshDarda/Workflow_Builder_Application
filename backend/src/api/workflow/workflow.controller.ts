import { Controller, Get, Post, Patch, Param, Delete } from '@nestjs/common';
import { WorkflowService } from './workflow.service';

@Controller('workflow')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Post()
  create() {
    return this.workflowService.create();
  }

  @Get()
  findAll() {
    return this.workflowService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workflowService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.workflowService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workflowService.remove(+id);
  }
}
