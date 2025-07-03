import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Slidebar from './components/Slidebar'
import LoginPage from './pages/Login'
import DashboardPage from './pages/Dashboard'
import TurnsPage from './pages/TurnsPage'
import SedesPages from './pages/SedesPages'
import SalonsPage from './pages/SalonsPage'
import ProcessesPage from './pages/ProcessesPage'
import InscriptionsPage from './pages/InscriptionsPage'
import ProfilePage from './pages/ProfilePage'
import PaymentPlansPage from './pages/PaymentPlansPage'

import { useFetchUserOnLoad } from './hooks/useFetchUserOnLoad'

import './App.css'

const isAuthenticated = () => !!localStorage.getItem('auth-storage') && !!JSON.parse(localStorage.getItem('auth-storage') || '{}').state.token

const ProtectedRoute = ({ children }: { children: React.JSX.Element }) => {
   return isAuthenticated() ? children : <Navigate to="/login" replace />
}

const AppLayout = ({ children }: { children: React.JSX.Element }) => {
   return (
      <div className="flex h-screen bg-gray-100">
         <Slidebar />
         <div className="flex-1 flex flex-col overflow-hidden ml-20 md:ml-20 transition-all duration-300">
            <Navbar />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
               {children}
            </main>
         </div>
      </div>
   )
}

function App() {
   useFetchUserOnLoad() // Fetch user data on component load
   return (
      <>
         <Router>
            <Routes>
               <Route
                  path='/login'
                  element={<LoginPage />}
               />

               <Route
                  path='/'
                  element={
                     <ProtectedRoute>
                        <AppLayout>
                           <DashboardPage />
                        </AppLayout>
                     </ProtectedRoute>
                  }
               />
               <Route
                  path='/turns'
                  element={
                     <ProtectedRoute>
                        <AppLayout>
                           <TurnsPage />
                        </AppLayout>
                     </ProtectedRoute>
                  }
               />
               <Route
                  path='/sedes'
                  element={
                     <ProtectedRoute>
                        <AppLayout>
                           <SedesPages />
                        </AppLayout>
                     </ProtectedRoute>
                  }
               />
               <Route
                  path='/salons'
                  element={
                     <ProtectedRoute>
                        <AppLayout>
                           <SalonsPage />
                        </AppLayout>
                     </ProtectedRoute>
                  }
               />
               <Route
                  path='/processes'
                  element={
                     <ProtectedRoute>
                        <AppLayout>
                           <ProcessesPage />
                        </AppLayout>
                     </ProtectedRoute>
                  }
               />
               <Route
                  path='/inscriptions'
                  element={
                     <ProtectedRoute>
                        <AppLayout>
                           <InscriptionsPage />
                        </AppLayout>
                     </ProtectedRoute>
                  }
               />
               <Route
                  path='/payment-plans'
                  element={
                     <ProtectedRoute>
                        <AppLayout>
                           <PaymentPlansPage />
                        </AppLayout>
                     </ProtectedRoute>
                  }
               />
               <Route
                  path='/profile'
                  element={
                     <ProtectedRoute>
                        <AppLayout>
                           <ProfilePage />
                        </AppLayout>
                     </ProtectedRoute>
                  }
               />
               <Route path="*" element={<Navigate to="/" />} />
            </Routes>
         </Router>
      </>
   )
}

export default App
