import axios from 'axios'

export async function runWorkflowAPI(workflowId: number, file: File) {
  const api = import.meta.env.VITE_API
  const data = new FormData()
  data.append('workflowId', workflowId.toString())
  data.append('file', file)

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${api}/workflow/run`,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: data,
  }

  try {
    const response = await axios.request(config)
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}
