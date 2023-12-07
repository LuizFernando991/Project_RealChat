import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import GlobalStyles from './styles/global-styles.ts'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <GlobalStyles />
      <Toaster
        toastOptions={{
          style: {
            backgroundColor: '#00B8D9',
            color: '#FFF',
            fontWeight: 'bold'
          }
        }}
      />
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
