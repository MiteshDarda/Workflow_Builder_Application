import ReactDOM from 'react-dom/client'
import './styles/output.css'
import './styles/index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './helper/router'
import { ReactFlowProvider } from 'reactflow'
import { Provider } from 'react-redux'
import store from './store'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <Provider store={store}>
      <ReactFlowProvider>
        <RouterProvider router={router} />
      </ReactFlowProvider>
    </Provider>
  </>,
)
