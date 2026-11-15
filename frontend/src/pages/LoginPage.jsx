import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './LoginPage.css'

const ROLES = [
  { id: 'STUDENT', label: 'Sinh viên', username: 'SV001', email: 'sinhvien@edu.vn', password: 'sv123', home: '/sinh-vien/dang-ky' },
  { id: 'ADMIN', label: 'Quản trị viên', username: 'admin', email: 'admin@edu.vn', password: 'admin123', home: '/admin' },
  { id: 'TRAINING', label: 'Phòng Đào tạo', username: 'pdt', email: 'pdt@edu.vn', password: 'pdt123', home: '/admin/dao-tao?module=dot-dang-ky' },
  { id: 'DEPARTMENT', label: 'Quản lý Khoa/Ngành', username: 'khoa', email: 'khoa@edu.vn', password: 'khoa123', home: '/admin/dao-tao?module=hoc-phan' },
  { id: 'FACILITIES', label: 'Quản lý Cơ sở vật chất', username: 'csvc', email: 'csvc@edu.vn', password: 'csvc123', home: '/quan-ly-csvc' },
  { id: 'FINANCE', label: 'Quản lý Tài chính', username: 'taichinh', email: 'taichinh@edu.vn', password: 'tc123', home: '/tai-chinh' },
]

export default function LoginPage() {
  const navigate = useNavigate()
  const [role, setRole] = useState(ROLES[0].id)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const selectedRole = ROLES.find((item) => item.id === role)

  const submit = (event) => {
    event.preventDefault()
    setError('')
    if (!username.trim() || !password) { setError('Vui lòng nhập đầy đủ thông tin đăng nhập.'); return }
    setLoading(true)
    window.setTimeout(() => {
      const account = ROLES.find((item) => item.id === role && [item.username, item.email].some((value) => value.toLowerCase() === username.trim().toLowerCase()))
      if (account && password === account.password) {
        localStorage.setItem('portal-session', JSON.stringify({ role: account.id, username: username.trim(), loggedInAt: Date.now() }))
        navigate(account.home)
      } else {
        setError('Tên đăng nhập hoặc mật khẩu không đúng với vai trò đã chọn.')
        setLoading(false)
      }
    }, 250)
  }

  return <main className="login-page"><section className="login-card" aria-labelledby="login-title">
    <div className="login-brand"><div className="brand-mark">P</div><div><strong>P.K.A STUDENT PORTAL</strong><span>Hệ thống đăng ký tín chỉ</span></div></div>
    <h1 id="login-title">Đăng nhập</h1><p className="login-intro">Chọn vai trò và sử dụng tài khoản được cấp để truy cập hệ thống.</p>
    {error && <div className="login-error" role="alert">{error}</div>}
    <form onSubmit={submit} noValidate>
      <label className="login-field"><span>Vai trò</span><select value={role} onChange={(event) => { setRole(event.target.value); setError('') }} aria-label="Vai trò đăng nhập">{ROLES.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
      <label className="login-field"><span>Email/Tên đăng nhập</span><input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Nhập email hoặc mã người dùng" autoComplete="username" /></label>
      <label className="login-field"><span>Mật khẩu</span><span className="password-control"><input type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Nhập mật khẩu" autoComplete="current-password" /><button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Ẩn' : 'Hiện'}</button></span></label>
      <div className="login-actions"><button type="button" className="button button-light" onClick={() => window.alert('Vui lòng liên hệ bộ phận phụ trách để đặt lại mật khẩu.')}>Quên mật khẩu</button><button className="button button-dark" disabled={loading}>{loading ? 'Đang đăng nhập…' : 'Đăng nhập'}</button></div>
    </form>
    <div className="demo-hint"><strong>Tài khoản demo · {selectedRole.label}</strong><span>{selectedRole.username} / {selectedRole.password}</span><span>{selectedRole.email} / {selectedRole.password}</span></div>
  </section></main>
}
