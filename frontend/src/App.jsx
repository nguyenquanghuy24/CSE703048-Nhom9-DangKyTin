import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SinhVienPage from './pages/SinhVienPage'
import DangKyHocPhanPage from './pages/DangKyHocPhanPage'
import ThoiKhoaBieuPage from './pages/ThoiKhoaBieuPage'

function RequireAuth({ children }) {
  try {
    const session = JSON.parse(localStorage.getItem('portal-session') || 'null')
    return session?.role === 'STUDENT' ? children : <Navigate to="/login" replace />
  } catch { return <Navigate to="/login" replace /> }
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/sinh-vien" element={<SinhVienPage />} />
        <Route path="/sinh-vien/dang-ky" element={<RequireAuth><DangKyHocPhanPage /></RequireAuth>} />
        <Route path="/sinh-vien/thoi-khoa-bieu" element={<RequireAuth><ThoiKhoaBieuPage /></RequireAuth>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
