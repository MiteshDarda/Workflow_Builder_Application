import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { CreateWorkflowDto } from './dto/create-workflow.dto';

@Controller('workflow')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  //* Create new Workflow .
  @Post()
  create(@Body() body: CreateWorkflowDto) {
    return this.workflowService.create(body);
  }

  //* Find all Workflows .
  @Get()
  findAll() {
    return this.workflowService.findAll();
  }

  //* Update Workflow .
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: CreateWorkflowDto) {
    return this.workflowService.update(+id, body);
  }
}
