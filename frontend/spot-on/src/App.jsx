import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import Loading from './component/Loading'
import Welcome from './pages/Welcome'
import { AuthProvider } from './component/AuthContext'
import { useAuth } from './component/AuthContext'
import './App.css'

function ProtectedRoute({children}) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/Welcome" />
}
function AppRoutes() {
  const { user } = useAuth();
  return (
   <div>
      <Loading />
      <Routes>
        <Route path="/Welcome" element={!user?<Welcome/>: <Navigate to='/' />} />
        <Route path="/SignUp" element={!user?<SignUp />:<Navigate to='/'/>} />
        <Route path="/Login" element={!user ? <Login />: <Navigate to='/'/>} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
    </Routes>
   </div>
  )
}

function App() {
  return (
   <AuthProvider>
     <Router>
      <AppRoutes />
    </Router>
   </AuthProvider>
  )
}

export default App
