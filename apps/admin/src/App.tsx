import { Refine, Authenticated } from '@refinedev/core'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import routerProvider from '@refinedev/react-router'
import { authProvider } from './providers/authProvider'
import { LoginPage } from './pages/login/LoginPage'
import { DashboardPage } from './pages/dashboard/DashboardPage'

export default function App() {
  return (
    <BrowserRouter>
      <Refine authProvider={authProvider} routerProvider={routerProvider}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <Authenticated key="dashboard" fallback={<Navigate to="/login" replace />} loading={null}>
                <DashboardPage />
              </Authenticated>
            }
          />
        </Routes>
      </Refine>
    </BrowserRouter>
  )
}
