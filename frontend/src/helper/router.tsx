import { createBrowserRouter } from 'react-router-dom'
import Navbar from '../components/common/navbar'
import Builder from '../components/builder'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navbar />,
    children: [{ path: '', element: <Builder /> }],
  },
])
