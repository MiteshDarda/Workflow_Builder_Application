import { HttpException, HttpStatus } from '@nestjs/common';
import { parse } from 'csv-parse';
import { getNode } from 'src/common/utils/utils';

export async function convert_format_node(res: any, req: any, next?: string) {
  try {
    if (!req.csv)
      throw new HttpException('CSV File Expected', HttpStatus.NO_CONTENT);
    req.json = await csvToJson(req.csv);

    req.currentNodeIndex++;
    await req.eventProgress.completed.push('Convert Format Node');
    req.eventProgress.completedPercentage =
      (req.currentNodeIndex * 100) / req.graph.length;
    const getNext = await deepCloneFunction(getNode);
    next = next?.replaceAll(' ', '_')?.toLowerCase();
    const Next: any = await getNext('./' + next + '.js', next);
    if (Next === undefined) return;
    return await Next(res, req, req.graph[req.currentNodeIndex + 1]);
  } catch (error) {
    console.log('Error Here', error);
    throw error;
  }
}

export async function convert(file) {
  const fileJson = await csvToJson(file);
  console.log('JSON', fileJson);
  return fileJson;
}

async function csvToJson(csv: any) {
  try {
    return new Promise((resolve, reject) => {
      parse(
        csv,
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
  } catch (error) {
    throw error;
  }
}

function deepCloneFunction(func: any) {
  const funcString = func.toString();
  const clonedFunc = eval('(' + funcString + ')');
  return clonedFunc;
}
