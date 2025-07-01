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
                        <div >
                           <Slidebar />
                           <div>
                              <Navbar />
                              <DashboardPage />
                           </div>
                        </div>
                     </ProtectedRoute>
                  }
               />
               <Route
                  path='/turns'
                  element={
                     <ProtectedRoute>
                        <div >
                           <Slidebar />
                           <div>
                              <Navbar />
                              <TurnsPage />
                           </div>
                        </div>
                     </ProtectedRoute>
                  }
               />
               <Route
                  path='/sedes'
                  element={
                     <ProtectedRoute>
                        <div >
                           <Slidebar />
                           <div>
                              <Navbar />
                              <SedesPages />
                           </div>
                        </div>
                     </ProtectedRoute>
                  }
               />
               <Route
                  path='/salons'
                  element={
                     <ProtectedRoute>
                        <div >
                           <Slidebar />
                           <div>
                              <Navbar />
                              <SalonsPage />
                           </div>
                        </div>
                     </ProtectedRoute>
                  }
               />
               <Route
                  path='/processes'
                  element={
                     <ProtectedRoute>
                        <div >
                           <Slidebar />
                           <div>
                              <Navbar />
                              <ProcessesPage />
                           </div>
                        </div>
                     </ProtectedRoute>
                  }
               />
               <Route
                  path='/inscriptions'
                  element={
                     <ProtectedRoute>
                        <div >
                           <Slidebar />
                           <div>
                              <Navbar />
                              <InscriptionsPage />
                           </div>
                        </div>
                     </ProtectedRoute>
                  }
               />
               <Route
                  path='/payment-plans'
                  element={
                     <ProtectedRoute>
                        <div >
                           <Slidebar />
                           <div>
                              <Navbar />
                              <PaymentPlansPage />
                           </div>
                        </div>
                     </ProtectedRoute>
                  }
               />
               <Route
                  path='/profile'
                  element={
                     <ProtectedRoute>
                        <div >
                           <Slidebar />
                           <div>
                              <Navbar />
                              <ProfilePage />
                           </div>
                        </div>
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
