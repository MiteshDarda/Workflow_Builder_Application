import Workflow from './helper/workflow'
import WorkflowList from './helper/workflow-list/WorkflowList'

function Builder() {
  //$ JSX .
  return (
    <>
      <div className="h-full w-full flex flex-col justify-between items-center">
        <div className="h-full w-full flex justify-around items-center p-2">
          <WorkflowList />
          <Workflow />
        </div>
        <div className="mb-4 overflow-hidden">
          <ul>
            <li>Use Backspace to Delete Node(s) or Connection(s)</li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default Builder
