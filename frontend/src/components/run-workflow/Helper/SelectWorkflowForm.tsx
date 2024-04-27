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

type PropType = {
  disabled: boolean
  loading: any
  setLoading: any
  workflow: any
  setWorkflow: any
  acceptedFiles: File[]
}

export default function SelectWorkflowForm({
  disabled,
  loading,
  setLoading,
  acceptedFiles,
  workflow,
  setWorkflow,
}: PropType) {
  const [workflowList, setWorkflowList] = useState<any[]>([])

  useEffect(() => {
    async function apiCall() {
      try {
        const all = await getAllWorkflowAPI()
        if (all) setWorkflowList(all.workflowIds)
      } catch (error) {
        //! show error
      }
    }
    apiCall()
  }, [])

  const handleChange = (event: SelectChangeEvent) => {
    setWorkflow(event.target.value)
  }

  async function runWorkflowHandler() {
    const res = await runWorkflowAPI(workflow, acceptedFiles[0])
    console.log(res)
  }
  return (
    <div className=" flex justify-center items-center gap-5">
      <div>Select Wrokflow : </div>
      <FormControl
        variant="filled"
        sx={{ m: 1, minWidth: 150 }}
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
