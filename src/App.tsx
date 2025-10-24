import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Login } from './pages/Login'
import { Dashboard, PersonalDashboard, Athletes, AthleteDetail, Wellness, Analytics, AnthropometryInput, StrengthInput, PowerInput, EnduranceInput, MeasurementHistory, TrainingJournal, Settings } from './pages'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><PersonalDashboard /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/athletes" element={<ProtectedRoute><Athletes /></ProtectedRoute>} />
          <Route path="/athletes/:id" element={<ProtectedRoute><AthleteDetail /></ProtectedRoute>} />
          <Route path="/athletes/:id/history" element={<ProtectedRoute><MeasurementHistory /></ProtectedRoute>} />
          <Route path="/athletes/:id/anthropometry" element={<ProtectedRoute><AnthropometryInput /></ProtectedRoute>} />
          <Route path="/athletes/:id/strength" element={<ProtectedRoute><StrengthInput /></ProtectedRoute>} />
          <Route path="/athletes/:id/power" element={<ProtectedRoute><PowerInput /></ProtectedRoute>} />
          <Route path="/athletes/:id/endurance" element={<ProtectedRoute><EnduranceInput /></ProtectedRoute>} />
          <Route path="/athletes/:id/journal" element={<ProtectedRoute><TrainingJournal /></ProtectedRoute>} />
          <Route path="/wellness" element={<ProtectedRoute><Wellness /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
