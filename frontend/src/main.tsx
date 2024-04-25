import ReactDOM from 'react-dom/client'
import './styles/output.css'
import './styles/font-family.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './helper/router'
import { ReactFlowProvider } from 'reactflow'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <ReactFlowProvider>
      <RouterProvider router={router} />
    </ReactFlowProvider>
  </>,
)
