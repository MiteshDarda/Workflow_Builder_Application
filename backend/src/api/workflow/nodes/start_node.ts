import { getNode } from 'src/common/utils/utils';
import { parse } from 'csv-parse';
import { stringify } from 'csv-stringify';

export async function start_node(res: any, req: any, next?: string) {
  try {
    req.csv = await fileToCsv(req.file);

    req.currentNodeIndex++;
    req.eventProgress.completed.push('Start Node');
    req.eventProgress.completedPercentage =
      (req.currentNodeIndex * 100) / req.graph.length;
    const getNext = await deepCloneFunction(getNode);
    next = next?.replaceAll(' ', '_')?.toLowerCase();
    const Next: any = await getNext('./' + next + '.js', next);
    if (Next === undefined) return;
    return await Next(res, req, req.graph[req.currentNodeIndex + 1]);
  } catch (error) {
    throw error;
  }
}

async function fileToCsv(file: any) {
  try {
    return new Promise((resolve, reject) => {
      parse(file.buffer, async (err, data) => {
        if (err) {
          console.error('Error parsing CSV:', err);
          reject(err);
          return;
        }
        stringify(data, (err, str) => {
          resolve(str);
        });
      });
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
