export async function getNode(location: string, nodeName: string) {
  console.log(location);
  try {
    const file = await import(location);
    const nodeFun = file?.[nodeName];
    return nodeFun;
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') return;
    throw error;
  }
}

export function deepCloneFunction(func: any) {
  const funcString = func.toString();
  const clonedFunc = eval('(' + funcString + ')');
  return clonedFunc;
}
