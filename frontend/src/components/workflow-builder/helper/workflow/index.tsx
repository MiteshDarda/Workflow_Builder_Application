import { useCallback, useState } from 'react'
import {
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
} from 'reactflow'
import 'reactflow/dist/style.css'
import SaveIcon from '@mui/icons-material/Save'
import { Tooltip } from '@mui/material'

const getId = () => `dndnode_${Date.now()}`

export default function Workflow() {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null)

  const onConnect = useCallback(
    (connection: Connection) => {
      const existingEdge = edges.find(
        (edge) =>
          edge.source === connection.source ||
          edge.target === connection.target,
      )
      if (!existingEdge) {
        setEdges((prevEdges) => addEdge({ ...connection }, prevEdges))
      } else {
        //! Generate Error on this
      }
    },
    [edges, setEdges],
  )

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault()

      const { type, name } = JSON.parse(
        event.dataTransfer.getData('application/reactflow'),
      )

      const position = reactFlowInstance?.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${name} node` },
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [reactFlowInstance, setNodes],
  )

  return (
    <div className=" w-[90%] h-[80%] border-4 mt-10 relative">
      <div className="flex items-center gap-2 absolute bottom-0 right-4 z-[999] translate-y-[120%]">
        <Tooltip title={'Save'}>
          <button className="bg-green-600 text-green-300 hover:bg-green-500 p-1 sm:px-3 sm:py-2 rounded-full cursor-pointer">
            <SaveIcon className=" hover:text-black" />
            Save
          </button>
        </Tooltip>
        <div className="text-red-600">Not Saved...</div>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        fitView
      >
        <Background variant={BackgroundVariant.Lines} />
        <Controls />
      </ReactFlow>
    </div>
  )
}
