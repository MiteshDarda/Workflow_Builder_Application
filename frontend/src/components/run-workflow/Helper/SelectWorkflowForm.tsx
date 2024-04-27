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

type PropType = {
  disabled: boolean
  loading: any
  setLoading: any
  workflow: any
  setWorkflow: any
}

export default function SelectWorkflowForm({
  disabled,
  loading,
  setLoading,
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
      >
        {' '}
        {loading ? <CircularProgress /> : <>Run</>}
      </Button>
    </div>
  )
}
