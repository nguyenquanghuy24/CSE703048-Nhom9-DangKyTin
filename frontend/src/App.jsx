import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
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
  TRAINING: '/admin/dao-tao?module=dot-dang-ky',
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

export default function App() {
  return <BrowserRouter><Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/" element={<RoleHome />} />
    <Route path="/sinh-vien" element={<RequireRole roles={['STUDENT']}><SinhVienPage /></RequireRole>} />
    <Route path="/sinh-vien/dang-ky" element={<RequireRole roles={['STUDENT']}><DangKyHocPhanPage /></RequireRole>} />
    <Route path="/sinh-vien/thoi-khoa-bieu" element={<RequireRole roles={['STUDENT']}><ThoiKhoaBieuPage /></RequireRole>} />
    <Route path="/admin" element={<RequireRole roles={['ADMIN']}><AdminPage /></RequireRole>} />
    <Route path="/admin/dao-tao" element={<RequireRole roles={['ADMIN', 'TRAINING', 'DEPARTMENT']}><QuanLyDaoTaoPage /></RequireRole>} />
    <Route path="/quan-ly-csvc" element={<RequireRole roles={['FACILITIES']}><QuanLyCoSoVatChatPage /></RequireRole>} />
    <Route path="/tai-chinh" element={<RequireRole roles={['FINANCE']}><QuanLyTaiChinhPage /></RequireRole>} />
    <Route path="*" element={<RoleHome />} />
  </Routes></BrowserRouter>
}
