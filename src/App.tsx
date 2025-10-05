import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { seedDatabase } from './config/seedDatabase'
import { coachService } from './services'
import { Dashboard, PersonalDashboard, Athletes, AthleteDetail, Wellness, Analytics, AnthropometryInput, StrengthInput, PowerInput, EnduranceInput, MeasurementHistory, TrainingJournal, Settings } from './pages'
import { Activity } from 'lucide-react'

function App() {
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const initApp = async () => {
      await seedDatabase()
      await coachService.initializeDefaultProfile()
      setIsInitialized(true)
    }
    
    initApp()
  }, [])

  // Écran de chargement
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center p-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent-primary/20 mb-6 animate-pulse">
            <Activity className="w-10 h-10 text-accent-primary" strokeWidth={2} />
          </div>
          <h1 className="text-5xl font-bold mb-4 text-text-primary">
            La Forge Athlétique
          </h1>
          <p className="text-xl text-text-secondary mb-8">
            Athlete Performance Optimizer
          </p>
          <div className="inline-block px-6 py-3 bg-accent-primary text-white font-medium rounded-lg shadow-glow-blue">
            Initialisation en cours...
          </div>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<PersonalDashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/athletes" element={<Athletes />} />
        <Route path="/athletes/:id" element={<AthleteDetail />} />
        <Route path="/athletes/:id/history" element={<MeasurementHistory />} />
        <Route path="/athletes/:id/anthropometry" element={<AnthropometryInput />} />
        <Route path="/athletes/:id/strength" element={<StrengthInput />} />
        <Route path="/athletes/:id/power" element={<PowerInput />} />
        <Route path="/athletes/:id/endurance" element={<EnduranceInput />} />
        <Route path="/athletes/:id/journal" element={<TrainingJournal />} />
        <Route path="/wellness" element={<Wellness />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
        {/* Les autres routes seront ajoutées progressivement */}
      </Routes>
    </Router>
  )
}

export default App
