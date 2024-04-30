import { parse } from 'csv-parse';
import { stringify } from 'csv-stringify';
// import { Parser } from '@json2csv/plainjs';
import { getNode } from 'src/common/utils/utils';
import { HttpException, HttpStatus } from '@nestjs/common';

export async function filter_data_node(res: any, req: any, next?: string) {
  try {
    if (!req.csv)
      throw new HttpException('CSV File Expected', HttpStatus.BAD_REQUEST);
    req.csv = await filter(req.csv, ['Name']);

    req.currentNodeIndex++;
    req.eventProgress.completed.push('Filter Node');
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

async function filter(csv: any, filterBy: any[]) {
  try {
    return new Promise((resolve, reject) => {
      parse(csv, { columns: true }, async (err, data) => {
        if (err) {
          console.error('Error parsing CSV:', err);
          reject(err);
          return;
        }
        const convertedCsv = [];
        data.filter((column: any) => {
          filterBy.filter((filter: any) => {
            column[filter] = column[filter].toLowerCase();
          });
          convertedCsv.push(column);
        });
        stringify(convertedCsv, (err, str) => {
          resolve(Object.keys(convertedCsv[0]) + '\n' + str);
        });
      });
    });
    // csv.filter((column: any) => {
    //   filterBy.filter((filter: any) => {
    //     column[filter] = column[filter].toLowerCase();
    //   });
    //   convertedCsv.push(column);
    // });
    // return convertedCsv;
  } catch (error) {
    throw error;
  }
}

// async function csvParseLowercase(file: any): Promise<any[]> {
//   try {
//     return new Promise((resolve, reject) => {
//       const result = [];
//       parse(file.buffer, (err, data) => {
//         if (err) {
//           console.error('Error parsing CSV:', err);
//           reject(err);
//           return;
//         }
//         data.forEach((row: any) => {
//           Object.keys(row).forEach((key: string) => {
//             row[key] = row[key].toLowerCase();
//           });
//           result.push(row);
//         });
//         resolve(result); // Resolve the promise with the modified data
//       });
//     });
//   } catch (error) {
//     throw error;
//   }
// }

function deepCloneFunction(func: any) {
  const funcString = func.toString();
  const clonedFunc = eval('(' + funcString + ')');
  return clonedFunc;
}
