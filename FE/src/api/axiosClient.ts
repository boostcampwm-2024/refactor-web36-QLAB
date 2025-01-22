import axios from 'axios'

const axiosClient = axios.create({
  baseURL: `${window.location.origin}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

export default axiosClient
