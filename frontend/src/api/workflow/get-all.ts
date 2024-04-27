import axios from 'axios'

export async function getAllWorkflowAPI() {
  const api = import.meta.env.VITE_API
  try {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${api}/workflow`,
      headers: {},
    }

    const response = await axios.request(config)
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}
