import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { HowItWorks } from './components/HowItWorks'
import { ScoringExplainer } from './components/ScoringExplainer'
import { AudienceSplit } from './components/AudienceSplit'
import { Resilience } from './components/Resilience'
import { FinalCTA } from './components/FinalCTA'
import { Footer } from './components/Footer'
import { Login } from './dashboard/Login'
import { Overview } from './dashboard/Overview'
import { LeadsList } from './dashboard/LeadsList'
import { LeadDetail } from './dashboard/LeadDetail'
import { DashboardLayout } from './dashboard/DashboardLayout'
import { ChatPage } from './chat/ChatPage'
import { FloatingBubble } from './chat/FloatingBubble'
import { AuthProvider, useAuth } from './AuthContext'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-[#555]">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <ScoringExplainer />
        <AudienceSplit />
        <Resilience />
        <FinalCTA />
      </main>
      <Footer />
      <FloatingBubble />
    </>
  )
}

function ComingSoon({ title }) {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <div className="font-display text-white" style={{ fontSize: '24px', letterSpacing: '-0.04em' }}>{title}</div>
        <div className="font-inter text-[13px] text-[#333] tracking-[-0.01em]">Coming soon</div>
      </div>
    </DashboardLayout>
  )
}

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ backgroundColor: '#0A0A0A', minHeight: '100vh' }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signin" element={<Navigate to="/login" replace />} />
            <Route path="/dashboard" element={<ProtectedRoute><Overview /></ProtectedRoute>} />
            <Route path="/dashboard/leads" element={<ProtectedRoute><LeadsList /></ProtectedRoute>} />
            <Route path="/dashboard/leads/:id" element={<ProtectedRoute><LeadDetail /></ProtectedRoute>} />
            <Route path="/chat" element={<ChatPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}
