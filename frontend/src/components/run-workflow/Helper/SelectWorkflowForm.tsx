import {
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { getAllWorkflowAPI } from '../../../api/workflow/get-all'
import { runWorkflowAPI } from '../../../api/workflow/run'
import { useDispatch } from 'react-redux'
import { setMessage } from '../../../store/reducers/message-slice'
import { MessageTypeEnum } from '../../../store/reducers/enums/message-type-enum'

//$ Type
type PropType = {
  disabled: boolean
  loading: any
  setLoading: any
  workflow: any
  setWorkflow: any
  acceptedFiles: File[]
  setEventId: any
  setProgress: any
}

export default function SelectWorkflowForm({
  disabled,
  loading,
  setLoading,
  acceptedFiles,
  workflow,
  setWorkflow,
  setEventId,
  setProgress,
}: PropType) {
  //$ Constants .
  const [workflowList, setWorkflowList] = useState<any[]>([])
  const dispatch = useDispatch()

  //$ Functions .
  // Form Change Handler
  const handleChange = (event: SelectChangeEvent) => {
    setWorkflow(event.target.value)
  }

  // Sends Workflow form
  async function runWorkflowHandler() {
    setLoading(true)
    setProgress(0)
    try {
      const res = await runWorkflowAPI(workflow, acceptedFiles[0])
      setEventId(res.eventId)
    } catch (error: any) {
      let message = `Error: Make sure workflow is properly connected from start to end`
      if (error.code === 'ERR_NETWORK') {
        message = 'Internal Server Error'
      }
      setLoading(false)
      dispatch(
        setMessage({
          type: MessageTypeEnum.ERROR,
          text: message,
        }),
      )
      console.log('>>>>>>>>', error)
    }
  }

  //$ Use Effects .
  useEffect(() => {
    async function apiCall() {
      try {
        const all = await getAllWorkflowAPI()
        if (all) setWorkflowList(all.workflowIds)
      } catch (error: any) {
        dispatch(
          setMessage({
            type: MessageTypeEnum.ERROR,
            text: `${error.response.status} ${error.response?.statusText}`,
          }),
        )
      }
    }
    apiCall()
  }, [])

  //$ JSX .
  return (
    <div className=" flex justify-center items-center gap-5 h-[2rem] sm:h-[4rem]">
      <div className="text-xs sm:text-base">Select Wrokflow : </div>
      <FormControl
        variant="filled"
        sx={{ m: 1, minWidth: 150, height: '100%' }}
        className="flex flex-col"
        disabled={disabled || loading}
      >
        <InputLabel id="demo-simple-select-filled-label">
          Workflow-Id
        </InputLabel>
        <Select
          labelId="demo-simple-select-filled-label"
          id="demo-simple-select-filled"
          value={workflow ?? ''}
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {workflowList.map((item) => (
            <MenuItem value={item.id} key={item.id}>
              {item.id}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        disabled={disabled || !workflow || loading}
        variant="contained"
        sx={{ height: '80%' }}
        onClick={runWorkflowHandler}
      >
        {' '}
        {loading ? <CircularProgress /> : <>Run</>}
      </Button>
    </div>
  )
}
