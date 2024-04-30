export async function end_node(res: any, req: any) {
  try {
    await req.eventProgress.completed.push('End Node');
    req.eventProgress.completedPercentage = 100;
    req.currentNodeIndex++;
  } catch (error) {
    throw error;
  }
}
