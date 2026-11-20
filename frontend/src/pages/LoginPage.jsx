import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './LoginPage.css'

const ROLES = [
  { id: 'STUDENT', label: 'Sinh viên', username: '23010030', email: '23010030@st.phenikaa-uni.edu.vn', password: 'sv123', home: '/sinh-vien/dang-ky' },
  { id: 'ADMIN', label: 'Quản trị viên', username: 'admin', email: 'admin@edu.vn', password: 'admin123', home: '/admin' },
  { id: 'TRAINING', label: 'Phòng Đào tạo', username: 'pdt', email: 'pdt@edu.vn', password: 'pdt123', home: '/admin/dao-tao?module=ke-hoach' },
  { id: 'DEPARTMENT', label: 'Quản lý Khoa/Ngành', username: 'khoa', email: 'khoa@edu.vn', password: 'khoa123', home: '/admin/dao-tao?module=chuong-trinh', facultyName: 'Khoa CNTT', programIds: ['480201-2023', '480103-2023', '480107-2025'] },
  { id: 'FACILITIES', label: 'Quản lý Cơ sở vật chất', username: 'csvc', email: 'csvc@edu.vn', password: 'csvc123', home: '/quan-ly-csvc' },
  { id: 'FINANCE', label: 'Quản lý Tài chính', username: 'taichinh', email: 'taichinh@edu.vn', password: 'tc123', home: '/tai-chinh' },
]

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [role, setRole] = useState(ROLES[0].id)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [passwordChangeOpen, setPasswordChangeOpen] = useState(false)
  const [passwordOverrides, setPasswordOverrides] = useState(() => { try { return JSON.parse(localStorage.getItem('portal-passwords') || '{}') } catch { return {} } })
  const selectedRole = ROLES.find((item) => item.id === role)

  const submit = (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    if (!username.trim() || !password) { setError('Vui lòng nhập đầy đủ thông tin đăng nhập.'); return }
    setLoading(true)
    window.setTimeout(() => {
      const account = ROLES.find((item) => item.id === role && [item.username, item.email].some((value) => value.toLowerCase() === username.trim().toLowerCase()))
      let savedPasswords = {}
      try { savedPasswords = JSON.parse(localStorage.getItem('portal-passwords') || '{}') } catch { savedPasswords = {} }
      if (account && password === (savedPasswords[account.id] || account.password)) {
        localStorage.setItem('portal-session', JSON.stringify({ role: account.id, username: username.trim(), email: account.email, facultyName: account.facultyName, programIds: account.programIds || [], loggedInAt: Date.now(), lastActivityAt: Date.now() }))
        navigate(account.home)
      } else {
        setError('Tên đăng nhập hoặc mật khẩu không đúng với vai trò đã chọn.')
        setLoading(false)
      }
    }, 250)
  }

  const changePassword = (event) => {
    event.preventDefault()
    const data = Object.fromEntries(new FormData(event.currentTarget))
    const account = ROLES.find((item) => item.id === role && [item.username, item.email].some((value) => value.toLowerCase() === username.trim().toLowerCase()))
    let savedPasswords = {}
    try { savedPasswords = JSON.parse(localStorage.getItem('portal-passwords') || '{}') } catch { savedPasswords = {} }
    if (!account || data.currentPassword !== (savedPasswords[account.id] || account.password)) { setError('Tài khoản hoặc mật khẩu cũ không đúng.'); setPasswordChangeOpen(false); return }
    if (data.newPassword.length < 6 || data.newPassword !== data.confirmPassword) { setError('Mật khẩu mới phải có ít nhất 6 ký tự và hai lần nhập phải khớp.'); setPasswordChangeOpen(false); return }
    localStorage.setItem('portal-passwords', JSON.stringify({ ...savedPasswords, [account.id]: data.newPassword }))
    setPasswordOverrides((current) => ({ ...current, [account.id]: data.newPassword }))
    setPassword('')
    setSuccess('Đổi mật khẩu thành công. Hãy đăng nhập bằng mật khẩu mới.')
    setPasswordChangeOpen(false)
  }

  return <main className="login-page"><section className="login-card" aria-labelledby="login-title">
    <div className="login-brand"><div className="brand-mark">P</div><div><strong>P.K.A STUDENT PORTAL</strong><span>Hệ thống đăng ký tín chỉ</span></div></div>
    <h1 id="login-title">Đăng nhập</h1><p className="login-intro">Chọn vai trò và sử dụng tài khoản được cấp để truy cập hệ thống.</p>
    {location.state?.sessionExpired && <div className="login-error" role="alert">Phiên làm việc đã hết, vui lòng đăng nhập lại!</div>}
    {error && <div className="login-error" role="alert">{error}</div>}
    {success && <div className="login-success" role="status">{success}</div>}
    <form onSubmit={submit} noValidate>
      <label className="login-field"><span>Vai trò</span><select value={role} onChange={(event) => { setRole(event.target.value); setError(''); setSuccess('') }} aria-label="Vai trò đăng nhập">{ROLES.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
      <label className="login-field"><span>Email/Tên đăng nhập</span><input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Nhập email hoặc mã người dùng" autoComplete="username" /></label>
      <label className="login-field"><span>Mật khẩu</span><span className="password-control"><input type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Nhập mật khẩu" autoComplete="current-password" /><button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Ẩn' : 'Hiện'}</button></span></label>
      <div className="login-actions"><button type="button" className="button button-light" onClick={() => { setError(''); setPasswordChangeOpen(true) }}>Đổi mật khẩu</button><button className="button button-dark" disabled={loading}>{loading ? 'Đang đăng nhập…' : 'Đăng nhập'}</button></div>
    </form>
    <div className="demo-hint"><strong>Tài khoản demo · {selectedRole.label}</strong><span>{selectedRole.username} / {passwordOverrides[selectedRole.id] || selectedRole.password}</span><span>{selectedRole.email} / {passwordOverrides[selectedRole.id] || selectedRole.password}</span></div>
  </section>{passwordChangeOpen && <div className="password-change-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setPasswordChangeOpen(false)}><form className="password-change-modal" onSubmit={changePassword}><header><div><span>BẢO MẬT TÀI KHOẢN</span><h2>Đổi mật khẩu</h2></div><button type="button" onClick={() => setPasswordChangeOpen(false)}>×</button></header><label>Email / tên đăng nhập<input value={username} onChange={(event) => setUsername(event.target.value)} required /></label><label>Mật khẩu cũ<input name="currentPassword" type="password" required /></label><label>Mật khẩu mới<input name="newPassword" type="password" minLength="6" required /></label><label>Xác nhận mật khẩu mới<input name="confirmPassword" type="password" minLength="6" required /></label><footer><button type="button" onClick={() => setPasswordChangeOpen(false)}>Hủy</button><button type="submit">Đồng ý</button></footer></form></div>}</main>
}
