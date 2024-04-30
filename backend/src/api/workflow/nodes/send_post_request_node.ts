import { HttpException, HttpStatus } from '@nestjs/common';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { getNode } from 'src/common/utils/utils';

export async function send_post_request_node(
  res: any,
  req: any,
  next?: string,
) {
  try {
    if (!req.json)
      throw new HttpException(
        'Csv not converted to JSON yet',
        HttpStatus.BAD_REQUEST,
      );
    await postData(req?.json ?? {});

    await req.eventProgress.completed.push('Send Post Node');
    req.eventProgress.completedPercentage =
      (req.currentNodeIndex * 100) / req.graph.length;
    req.currentNodeIndex++;
    const getNext = await deepCloneFunction(getNode);
    next = next?.replaceAll(' ', '_')?.toLowerCase();
    const Next: any = await getNext('./' + next + '.js', next);
    console.log('Next>>', Next);
    if (Next === undefined) return;
    return await Next(res, req, req.graph[req.currentNodeIndex + 1]);
  } catch (error) {
    throw error;
  }
}

async function postData(json: any): Promise<void> {
  try {
    const data = JSON.stringify({
      data: json,
    });

    const config: AxiosRequestConfig = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://workflow-builder.requestcatcher.com/test',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };

    const response: AxiosResponse = await axios.request(config);
    console.log(JSON.stringify(response.data));
  } catch (error) {
    console.log(error);
  }
}

function deepCloneFunction(func: any) {
  const funcString = func.toString();
  const clonedFunc = eval('(' + funcString + ')');
  return clonedFunc;
}
