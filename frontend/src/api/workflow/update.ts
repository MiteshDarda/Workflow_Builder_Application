import axios from 'axios'

export async function updateWorkflowAPI(nodes: any, edges: any, id: number) {
  const api = import.meta.env.VITE_API
  try {
    const data = JSON.stringify({
      nodes,
      edges,
    })

    const config = {
      method: 'patch',
      maxBodyLength: Infinity,
      url: `${api}/workflow/${id}`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    }

    const response = await axios.request(config)
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}
