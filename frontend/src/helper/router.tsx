import { createBrowserRouter } from 'react-router-dom'
import Navbar from '../components/common/navbar'
import Builder from '../components/workflow-builder'
import RunWorkflow from '../components/run-workflow'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navbar />,
    children: [
      { path: '', element: <Builder /> },
      { path: '/run-workflow', element: <RunWorkflow /> },
    ],
  },
])
