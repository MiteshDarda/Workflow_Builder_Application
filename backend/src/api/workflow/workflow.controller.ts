import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { RunWorkflowDto } from './dto/run-workflow.dto';

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

  //* Run Workflow .
  @Post('run')
  @UseInterceptors(FileInterceptor('file'))
  run(@Body() body: RunWorkflowDto, @UploadedFile() file: File) {
    return this.workflowService.run(body.workflowId, file);
  }
}
