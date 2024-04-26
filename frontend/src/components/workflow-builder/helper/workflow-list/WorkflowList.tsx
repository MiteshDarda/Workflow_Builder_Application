import { useEffect, useState } from 'react'
import { useNodes } from 'reactflow'

export default function WorkflowList() {
  const [totalStartNodes, setTotalStartNodes] = useState<number>(0)
  const [totalEndNodes, setTotalEndNodes] = useState<number>(0)
  const nodes = useNodes<any>()
  useEffect(() => {
    let startNodes = 0
    let endNodes = 0
    nodes.map((node) => {
      if (node.data?.label === 'Start node') startNodes++
      if (node.data?.label === 'End node') endNodes++
    })
    setTotalStartNodes(startNodes)
    setTotalEndNodes(endNodes)
  }, [nodes])

  const onDragStart = (event: any, nodeData: any) => {
    if (
      (totalStartNodes && nodeData.name === 'Start') ||
      (totalEndNodes && nodeData.name === 'End')
    ) {
      event.preventDefault()
      return
    }
    // if (nodeData.name === 'Start') setTotalStartNodes((prev) => prev + 1)
    // console.log(nodeData)
    // if (
    //   (nodeData.name === 'Start' || nodeData.name === 'End') &&
    //   nodes.find((node) => node.data?.label === nodeData.name)
    // ) {
    //   event.preventDefault() // Prevent dragging if the node is "Start" or "End" and already exists
    //   return
    // }
    event.dataTransfer.setData(
      'application/reactflow',
      JSON.stringify(nodeData),
    )
    event.dataTransfer.effectAllowed = 'move'
  }

  const workFlowNodesList = [
    { name: 'Start', type: 'input' },
    { name: 'Filter Data', type: '' },
    { name: 'Wait', type: '' },
    { name: 'Convert Format', type: '' },
    { name: 'Send POST Request', type: '' },
    { name: 'End', type: 'output' },
  ]
  return (
    <div className="bg-gray-700">
      <div className="bg-gray-700 text-white text-center py-5 shadow-md">
        {'Workflow-Nodes'}
      </div>
      {workFlowNodesList.map((nodeData, ind) => {
        return (
          <div
            // className="dndnode text-wrap h-full bg-gray-200 hover:bg-gray-300 m-2 my-4 text-center py-5 shadow-md hover:shadow-xl rounded-lg"
            className={`dndnode text-wrap h-full bg-gray-200 m-2 my-4 text-center py-5 shadow-md rounded-lg 
            ${
              (nodeData.name === 'Start' && totalStartNodes) ||
              (nodeData.name === 'End' && totalEndNodes)
                ? ' bg-red-400 cursor-not-allowed'
                : ' hover:shadow-xl hover:bg-gray-300 cursor-grab'
            }`}
            key={ind}
            draggable="true"
            onDragStart={(event) => onDragStart(event, nodeData)}
          >
            {nodeData.name}
          </div>
        )
      })}
    </div>
  )
}
