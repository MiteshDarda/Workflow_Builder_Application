import { Tooltip } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNodes } from 'reactflow'

export default function WorkflowList() {
  //$ Constants .
  const [totalStartNodes, setTotalStartNodes] = useState<number>(0)
  const [totalEndNodes, setTotalEndNodes] = useState<number>(0)
  const nodes = useNodes<any>()
  const workFlowNodesList = [
    { name: 'Start', type: 'input' },
    { name: 'Filter Data', type: '' },
    { name: 'Wait', type: '' },
    { name: 'Convert Format', type: '' },
    { name: 'Send POST Request', type: '' },
    { name: 'End', type: 'output' },
  ]

  //$ Functions .
  const onDragStart = (event: any, nodeData: any) => {
    if (
      (totalStartNodes && nodeData.name === 'Start') ||
      (totalEndNodes && nodeData.name === 'End')
    ) {
      event.preventDefault()
      return
    }
    event.dataTransfer.setData(
      'application/reactflow',
      JSON.stringify(nodeData),
    )
    event.dataTransfer.effectAllowed = 'move'
  }

  //$ Use Effects .
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

  //$ JSX .
  return (
    <div className="bg-gray-700">
      <div className="bg-gray-700 text-white text-center sm:py-5 shadow-md">
        {'Workflow-Nodes'}
      </div>
      <>
        {workFlowNodesList.map((nodeData, ind) => {
          return (
            <Tooltip
              title={
                (nodeData.name === 'Start' && totalStartNodes) ||
                (nodeData.name === 'End' && totalEndNodes)
                  ? 'Only 1 Allowded'
                  : 'Drag to Canvas'
              }
              key={ind}
              draggable="true"
            >
              <div
                className={`dndnode text-wrap h-full bg-gray-200 sm:m-2 m-1 sm:my-4 my-2 text-center sm:py-5 shadow-md rounded-lg 
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
            </Tooltip>
          )
        })}
      </>
    </div>
  )
}
