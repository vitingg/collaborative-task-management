export function sliceTaskId(taskId: string) {
  const sliced = taskId.slice(0, 7);
  return <p>TASK-{sliced}</p>;
}
