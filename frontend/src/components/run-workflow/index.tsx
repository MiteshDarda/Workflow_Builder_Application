import { useEffect, useState } from 'react'
import DragDrop from './Helper/DragDrop'
import SelectWorkflowForm from './Helper/SelectWorkflowForm'
import { LinearProgress } from '@mui/material'
import { useDispatch } from 'react-redux'
import { setMessage } from '../../store/reducers/message-slice'
import { MessageTypeEnum } from '../../store/reducers/enums/message-type-enum'

export default function RunWorkflow() {
  //$ Constants .
  const api = import.meta.env.VITE_API
  const [acceptedFiles, setAcceptedFiles] = useState<File[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [workflow, setWorkflow] = useState<number | null>(null)
  const [eventId, setEventId] = useState<number | null>(null)
  const [progress, setProgress] = useState(0)
  const [completedWork, setCompletedWork] = useState([])
  const dispatch = useDispatch()

  //$ Use Effect .
  useEffect(() => {
    if (!eventId) return
    setLoading(true)
    const eventSource = new EventSource(`${api}/workflow/sse/${eventId}`)
    eventSource.onopen = () => console.log('Connection established')
    eventSource.onerror = (error: any) => {
      setProgress(0)
      setLoading(false)
      setCompletedWork([])
      setEventId(null)
      let messageText = 'Internal Server Error'
      if (error?.data) {
        const response = JSON.parse(error.data)
        messageText = response.errorMessage.message
      }
      dispatch(
        setMessage({
          type: MessageTypeEnum.ERROR,
          text: messageText,
        }),
      )
      eventSource?.close()
      console.error('EventSource error:', error)
    }

    eventSource.addEventListener('close', (event) => {
      console.log('Close', event)
      setProgress(100)
      setLoading(false)
      eventSource.close()
    })

    eventSource.addEventListener('message', (event: any) => {
      const response = JSON.parse(event.data)
      setProgress(response?.completedPercentage)
      if (response?.completedPercentage === 100) {
        setLoading(false)
        eventSource.close()
      }
      setCompletedWork(response?.completed ?? [])
      console.log('message', JSON.parse(event.data))
    })

    return () => {
      setLoading(false)
      eventSource.close()
    }
  }, [eventId])

  //$ JSX .
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-around sm:pt-10 ">
      <DragDrop
        disabled={loading}
        acceptedFiles={acceptedFiles}
        setAcceptedFiles={setAcceptedFiles}
      />
      <SelectWorkflowForm
        disabled={!acceptedFiles.length}
        acceptedFiles={acceptedFiles}
        loading={loading}
        setLoading={setLoading}
        workflow={workflow}
        setWorkflow={setWorkflow}
        setEventId={setEventId}
        setProgress={setProgress}
      />
      <div className="w-[80%] flex flex-col justify-center items-center gap-2">
        <div>
          {progress > 0 ? (
            <>
              Completed:{' '}
              {completedWork.map((work, i) => (
                <span
                  className=" text-xs bg-gray-800 text-white m-1 p-1 rounded-lg"
                  key={i}
                >
                  {work}
                </span>
              ))}{' '}
            </>
          ) : (
            <></>
          )}
        </div>
        <div>
          <LinearProgress
            variant="buffer"
            sx={{ height: '1rem', width: '80vw', borderRadius: '0.5rem' }}
            // variant="determinate"
            value={progress}
            valueBuffer={Math.min(100, progress)}
          />
        </div>
      </div>
    </div>
  )
}
