import axios from 'axios'

export async function createWorkflow(nodes: any, edges: any) {
  const api = import.meta.env.VITE_API
  try {
    const data = JSON.stringify({
      nodes,
      edges,
    })

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${api}/workflow`,
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
