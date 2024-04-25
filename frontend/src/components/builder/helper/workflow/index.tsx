import { useCallback, useState } from 'react'
import {
  Background,
  Connection,
  Controls,
  MiniMap,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
} from 'reactflow'

import 'reactflow/dist/style.css'

// let id = 0
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
    <div className=" w-[90%] h-[80%] border-4 mt-10">
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
        <Background />
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  )
}
