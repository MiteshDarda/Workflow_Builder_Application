import { HttpException, HttpStatus } from '@nestjs/common';
import { getNode } from 'src/common/utils/utils';

export async function wait_node(res: any, req: any, next?: string) {
  try {
    // Delays for 5 seconds
    await delay(5);

    req.currentNodeIndex++;
    await req.eventProgress.completed.push('Wait Node');
    req.eventProgress.completedPercentage =
      (req.currentNodeIndex * 100) / req.graph.length;
    const getNext = await deepCloneFunction(getNode);
    next = next?.replaceAll(' ', '_')?.toLowerCase();
    const Next: any = await getNext('./' + next + '.js', next);
    if (Next === undefined) return;
    return await Next(res, req, req.graph[req.currentNodeIndex + 1]);
  } catch (error) {
    throw new HttpException(
      'Filter Data Node : Error in reading file',
      HttpStatus.BAD_REQUEST,
    );
  }
}

async function delay(s: number) {
  const ms = s * 1000;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function deepCloneFunction(func: any) {
  const funcString = func.toString();
  const clonedFunc = eval('(' + funcString + ')');
  return clonedFunc;
}
