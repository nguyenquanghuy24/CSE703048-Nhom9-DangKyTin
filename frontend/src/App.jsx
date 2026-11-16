import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SinhVienPage from './pages/SinhVienPage'
import DangKyHocPhanPage from './pages/DangKyHocPhanPage'
import ThoiKhoaBieuPage from './pages/ThoiKhoaBieuPage'
import AdminPage from './pages/AdminPage'
import QuanLyDaoTaoPage from './pages/QuanLyDaoTaoPage'
import QuanLyCoSoVatChatPage from './pages/QuanLyCoSoVatChatPage'
import QuanLyTaiChinhPage from './pages/QuanLyTaiChinhPage'

const ROLE_HOME = {
  STUDENT: '/sinh-vien/dang-ky',
  ADMIN: '/admin',
  TRAINING: '/admin/dao-tao?module=ke-hoach',
  DEPARTMENT: '/admin/dao-tao?module=hoc-phan',
  FACILITIES: '/quan-ly-csvc',
  FINANCE: '/tai-chinh',
}

function getSession() {
  try { return JSON.parse(localStorage.getItem('portal-session') || 'null') } catch { return null }
}

function RequireRole({ roles, children }) {
  const session = getSession()
  if (!session) return <Navigate to="/login" replace />
  if (!roles.includes(session.role)) return <Navigate to={ROLE_HOME[session.role] || '/login'} replace />
  return children
}

function RoleHome() {
  const session = getSession()
  return <Navigate to={ROLE_HOME[session?.role] || '/login'} replace />
}

function SessionTimeout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  useEffect(() => {
    if (location.pathname === '/login') return undefined
    let lastWrite = 0
    const recordActivity = () => {
      const now = Date.now()
      if (now - lastWrite < 15000) return
      lastWrite = now
      const session = getSession()
      if (session) localStorage.setItem('portal-session', JSON.stringify({ ...session, lastActivityAt: now }))
    }
    const activityEvents = ['pointerdown', 'pointermove', 'keydown', 'touchstart', 'scroll']
    activityEvents.forEach((name) => window.addEventListener(name, recordActivity, { passive: true }))
    const timer = window.setInterval(() => {
      const session = getSession()
      if (!session) return
      if (Date.now() - (session.lastActivityAt || session.loggedInAt || Date.now()) >= 10 * 60 * 1000) {
        localStorage.removeItem('portal-session')
        navigate('/login', { replace: true, state: { sessionExpired: true } })
      }
    }, 15000)
    return () => {
      activityEvents.forEach((name) => window.removeEventListener(name, recordActivity))
      window.clearInterval(timer)
    }
  }, [location.pathname, navigate])
  return children
}

export default function App() {
  return <BrowserRouter><SessionTimeout><Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/" element={<RoleHome />} />
    <Route path="/sinh-vien" element={<RequireRole roles={['STUDENT']}><SinhVienPage /></RequireRole>} />
    <Route path="/sinh-vien/dang-ky" element={<RequireRole roles={['STUDENT']}><DangKyHocPhanPage /></RequireRole>} />
    <Route path="/sinh-vien/thoi-khoa-bieu" element={<RequireRole roles={['STUDENT']}><ThoiKhoaBieuPage /></RequireRole>} />
    <Route path="/admin" element={<RequireRole roles={['ADMIN']}><AdminPage /></RequireRole>} />
    <Route path="/admin/dao-tao" element={<RequireRole roles={['TRAINING', 'DEPARTMENT']}><QuanLyDaoTaoPage /></RequireRole>} />
    <Route path="/quan-ly-csvc" element={<RequireRole roles={['FACILITIES']}><QuanLyCoSoVatChatPage /></RequireRole>} />
    <Route path="/tai-chinh" element={<RequireRole roles={['FINANCE']}><QuanLyTaiChinhPage /></RequireRole>} />
    <Route path="*" element={<RoleHome />} />
  </Routes></SessionTimeout></BrowserRouter>
}
