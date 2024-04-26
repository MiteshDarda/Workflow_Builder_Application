import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class Node {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsString()
  type: string;

  @IsNotEmpty()
  position: any;

  @IsNotEmpty()
  data: any;

  @IsNotEmpty()
  width: number;

  @IsNotEmpty()
  height: number;
}

class Edge {
  @IsNotEmpty()
  @IsString()
  source: string;

  @IsNotEmpty()
  @IsString()
  target: string;

  @IsNotEmpty()
  @IsString()
  id: string;
}

export class CreateWorkflowDto {
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Node)
  nodes: Node[];

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Edge)
  edges: Edge[];
}
