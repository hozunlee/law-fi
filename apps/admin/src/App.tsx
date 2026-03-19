import { Refine, Authenticated } from '@refinedev/core'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import routerProvider from '@refinedev/react-router'
import { dataProvider, liveProvider } from '@refinedev/supabase'
import { authProvider } from './providers/authProvider'
import { supabase } from './lib/supabaseClient'
import { LoginPage } from './pages/login/LoginPage'
import { DashboardPage } from './pages/dashboard/DashboardPage'

export default function App() {
  return (
    <BrowserRouter>
      <Refine
        authProvider={authProvider}
        dataProvider={dataProvider(supabase)}
        liveProvider={liveProvider(supabase)}
        routerProvider={routerProvider}
        options={{ liveMode: 'auto' }}
      >
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
