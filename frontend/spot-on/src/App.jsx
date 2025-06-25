import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import { AuthProvider } from './component/AuthContext'
import { useAuth } from './component/AuthContext'
import './App.css'

function ProtectedRoute({children}) {
  const { user, loading } = useAuth()
  if (loading) {
    return <h1>Loading...</h1>
  }
  return user ? children : <Navigate to="/Login" />
}
function AppRoutes() {
  const { user,loading } = useAuth();
  if (loading) {
    return <h1>Loading...</h1>
  }
  return (
    <Routes>
    <Route path="/SignUp" element={!user?<SignUp />:<Navigate to='/'/>} />
    <Route path="/Login" element={!user ? <Login />: <Navigate to='/'/>} />
    <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
  </Routes>
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
