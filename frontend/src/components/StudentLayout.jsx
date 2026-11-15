import { NavLink, useNavigate } from 'react-router-dom'
import './StudentLayout.css'

const menu = [
  { key: 'dang-ky', label: 'Đăng ký học phần', to: '/sinh-vien/dang-ky' },
  { key: 'da-dang-ky', label: 'Học phần đã đăng ký', to: '/sinh-vien/dang-ky?tab=registered' },
  { key: 'thoi-khoa-bieu', label: 'Thời khóa biểu', to: '/sinh-vien/thoi-khoa-bieu' },
]

export default function StudentLayout({ active, children, breadcrumb }) {
  const navigate = useNavigate()
  const session = (() => { try { return JSON.parse(localStorage.getItem('portal-session') || 'null') } catch { return null } })()
  const studentAccount = session?.username || 'SV001'
  const logout = () => { localStorage.removeItem('portal-session'); navigate('/login', { replace: true }) }
  return (
    <div className="student-shell">
      <aside className="student-sidebar">
        <div className="student-brand">
          <div className="student-brand-mark">P</div>
          <div><strong>P.K.A</strong><span>Student Portal</span></div>
        </div>
        <nav className="student-nav" aria-label="Điều hướng sinh viên">
          {menu.map((item) => <NavLink key={item.key} to={item.to} className={({ isActive }) => `student-nav-link ${active === item.key || isActive && active !== 'dang-ky' ? 'active' : ''}`}>{item.label}</NavLink>)}
        </nav>
        <div className="student-sidebar-bottom">
          <div className="student-account-mini"><span className="student-avatar">SV</span><span><strong>Sinh viên</strong><small>{studentAccount}</small></span></div>
          <button className="logout-link" onClick={logout}>Đăng xuất <span>↗</span></button>
        </div>
      </aside>
      <main className="student-main">
        <div className="student-breadcrumb">Cổng sinh viên <span>/</span> {breadcrumb}</div>
        {children}
      </main>
    </div>
  )
}

export function Notice({ type = 'info', children }) {
  return <div className={`student-notice notice-${type}`} role="status"><span className="notice-dot" />{children}</div>
}

export function Modal({ title, children, onClose }) {
  return <div className="student-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="student-modal" role="dialog" aria-modal="true"><div className="student-modal-head"><h2>{title}</h2><button onClick={onClose} aria-label="Đóng">×</button></div>{children}</section></div>
}
