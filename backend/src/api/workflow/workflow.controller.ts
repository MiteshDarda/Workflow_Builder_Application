import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  Body,
} from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { CreateWorkflowDto } from './dto/create-workflow.dto';

@Controller('workflow')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Post()
  create(@Body() body: CreateWorkflowDto) {
    return this.workflowService.create(body);
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
  update(@Param('id') id: string, @Body() body: CreateWorkflowDto) {
    return this.workflowService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workflowService.remove(+id);
  }
}
