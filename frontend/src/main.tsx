import ReactDOM from 'react-dom/client'
import './styles/output.css'
import './styles/index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './helper/router'
import { ReactFlowProvider } from 'reactflow'
import { Provider } from 'react-redux'
import store from './store'
import Background from './components/common/background'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <Provider store={store}>
      <ReactFlowProvider>
        <Background />
        <RouterProvider router={router} />
      </ReactFlowProvider>
    </Provider>
  </>,
)
