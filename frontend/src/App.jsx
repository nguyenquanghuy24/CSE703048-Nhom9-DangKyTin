import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import SinhVienPage from './pages/SinhVienPage'
import AdminPage from './pages/AdminPage'

function App() {
  return (
    <BrowserRouter>
      {/* Thanh Menu điều hướng */}
      <nav style={{ padding: '15px 30px', background: '#2c3e50', marginBottom: '20px' }}>
        <Link to="/" style={{ color: 'white', marginRight: '30px', textDecoration: 'none', fontSize: '18px', fontWeight: 'bold' }}>Trang Sinh Viên</Link>
        <Link to="/admin" style={{ color: 'white', textDecoration: 'none', fontSize: '18px', fontWeight: 'bold' }}>Trang Admin</Link>
      </nav>

      {/* Khu vực nội dung thay đổi theo link */}
      <div style={{ padding: '0 30px' }}>
        <Routes>
          <Route path="/" element={<SinhVienPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App