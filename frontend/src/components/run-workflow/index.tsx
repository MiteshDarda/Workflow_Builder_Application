import { useState } from 'react'
import DragDrop from './Helper/DragDrop'
import SelectWorkflowForm from './Helper/SelectWorkflowForm'

export default function RunWorkflow() {
  const [acceptedFiles, setAcceptedFiles] = useState<File[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [workflow, setWorkflow] = useState<number | null>(null)

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-around sm:pt-10 ">
      <DragDrop
        disabled={loading}
        acceptedFiles={acceptedFiles}
        setAcceptedFiles={setAcceptedFiles}
      />
      <SelectWorkflowForm
        disabled={!acceptedFiles.length}
        loading={loading}
        setLoading={setLoading}
        workflow={workflow}
        setWorkflow={setWorkflow}
      />
    </div>
  )
}
