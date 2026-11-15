import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = (event) => {
    event.preventDefault(); setError('')
    if (!username.trim() || !password) { setError('Vui lòng nhập đầy đủ thông tin đăng nhập.'); return }
    setLoading(true)
    window.setTimeout(() => {
      if ((username.trim().toLowerCase() === 'sinhvien@edu.vn' || username.trim().toUpperCase() === 'SV001') && password === 'sv123') {
        localStorage.setItem('portal-session', JSON.stringify({ role: 'STUDENT', username: username.trim(), loggedInAt: Date.now() }))
        navigate('/sinh-vien/dang-ky')
      } else { setError('Tên đăng nhập hoặc mật khẩu không đúng.'); setLoading(false) }
    }, 350)
  }

  return <main className="login-page"><section className="login-card" aria-labelledby="login-title">
    <div className="login-brand"><div className="brand-mark">P</div><div><strong>P.K.A STUDENT PORTAL</strong><span>Hệ thống đăng ký tín chỉ</span></div></div>
    <h1 id="login-title">Đăng nhập</h1><p className="login-intro">Sử dụng tài khoản sinh viên để truy cập cổng đăng ký học phần.</p>
    {error && <div className="login-error" role="alert">{error}</div>}
    <form onSubmit={submit} noValidate>
      <label className="login-field"><span>Email/Tên đăng nhập</span><input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Nhập email hoặc mã sinh viên" autoComplete="username" /></label>
      <label className="login-field"><span>Mật khẩu</span><span className="password-control"><input type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Nhập mật khẩu" autoComplete="current-password" /><button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Ẩn' : 'Hiện'}</button></span></label>
      <div className="login-actions"><button type="button" className="button button-light" onClick={() => window.alert('Vui lòng liên hệ Phòng Đào tạo để đặt lại mật khẩu.')}>Quên mật khẩu</button><button className="button button-dark" disabled={loading}>{loading ? 'Đang đăng nhập…' : 'Đăng nhập'}</button></div>
    </form>
    <div className="demo-hint"><strong>Tài khoản minh họa</strong><span>Sinh viên: sinhvien@edu.vn / sv123</span><span>Mã sinh viên: SV001 / sv123</span></div>
  </section></main>
}
