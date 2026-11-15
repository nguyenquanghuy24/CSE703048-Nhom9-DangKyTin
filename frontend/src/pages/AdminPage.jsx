import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './AdminPage.css'

const GROUPS = [
  { id: 'STUDENT', label: 'Sinh viên', prefix: 'SV' },
  { id: 'TRAINING', label: 'Phòng Đào tạo', prefix: 'NV' },
  { id: 'DEPARTMENT', label: 'Quản lý Khoa/Ngành', prefix: 'NV' },
  { id: 'FACILITIES', label: 'Quản lý CSVC', prefix: 'NV' },
  { id: 'FINANCE', label: 'Quản lý Tài chính', prefix: 'NV' },
  { id: 'ADMIN', label: 'Quản trị viên', prefix: 'AD' },
]
const seedAccounts = [
  { id: 1, code: 'SV001', name: 'Nguyễn Văn An', email: 'an.nv@edu.vn', group: 'STUDENT', detail: 'CNTT01 · Khóa 2022', status: 'Hoạt động' },
  { id: 2, code: 'SV002', name: 'Trần Thị Bình', email: 'binh.tt@edu.vn', group: 'STUDENT', detail: 'CNTT01 · Khóa 2022', status: 'Hoạt động' },
  { id: 3, code: 'NV101', name: 'Bùi Thị Quỳnh', email: 'pdt@edu.vn', group: 'TRAINING', detail: 'Phòng Đào tạo', status: 'Hoạt động' },
  { id: 4, code: 'NV201', name: 'Nguyễn Mạnh Hùng', email: 'khoa@edu.vn', group: 'DEPARTMENT', detail: 'Khoa CNTT', status: 'Hoạt động' },
  { id: 5, code: 'NV301', name: 'Lê Minh Châu', email: 'csvc@edu.vn', group: 'FACILITIES', detail: 'Cơ sở vật chất', status: 'Hoạt động' },
  { id: 6, code: 'NV401', name: 'Hoàng Thu Hà', email: 'taichinh@edu.vn', group: 'FINANCE', detail: 'Phòng Tài chính', status: 'Hoạt động' },
  { id: 7, code: 'AD001', name: 'Quản trị hệ thống', email: 'admin@edu.vn', group: 'ADMIN', detail: 'Quản trị viên', status: 'Hoạt động' },
]

export default function AdminPage() {
  const navigate = useNavigate()
  const [accounts, setAccounts] = useState(seedAccounts)
  const [group, setGroup] = useState('ALL')
  const [query, setQuery] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [detail, setDetail] = useState(null)
  const rows = useMemo(() => accounts.filter((account) => (group === 'ALL' || account.group === group) && `${account.code} ${account.name} ${account.email}`.toLowerCase().includes(query.toLowerCase())), [accounts, group, query])
  const logout = () => { localStorage.removeItem('portal-session'); navigate('/login', { replace: true }) }
  const saveAccount = (event) => {
    event.preventDefault()
    const data = Object.fromEntries(new FormData(event.currentTarget))
    if (editing) {
      setAccounts((current) => current.map((item) => item.id === editing.id ? { ...item, name: data.name, email: data.email, group: data.group, detail: data.detail } : item))
      setFormOpen(false)
      setEditing(null)
      return
    }
    const role = GROUPS.find((item) => item.id === data.group)
    const id = Math.max(0, ...accounts.map((item) => item.id)) + 1
    setAccounts((current) => [...current, { id, code: `${role.prefix}${String(id).padStart(3, '0')}`, name: data.name, email: data.email, group: data.group, detail: data.detail || role.label, status: 'Hoạt động' }])
    setFormOpen(false)
  }
  const toggleStatus = (account) => setAccounts((current) => current.map((item) => item.id === account.id ? { ...item, status: item.status === 'Hoạt động' ? 'Đã khóa' : 'Hoạt động' } : item))
  const remove = (account) => { if (window.confirm(`Xóa tài khoản ${account.email}?`)) setAccounts((current) => current.filter((item) => item.id !== account.id)) }

  return <div className="admin-page">
    <aside className="admin-sidebar"><a className="admin-brand" href="/admin"><span>P</span><div><b>P.K.A</b><small>Academic portal</small></div></a><div className="admin-menu-caption">QUẢN TRỊ HỆ THỐNG</div><button className="admin-nav active">Quản lý tài khoản</button><div className="admin-menu-caption secondary">NGHIỆP VỤ</div><button className="admin-nav" onClick={() => navigate('/admin/dao-tao?module=hoc-phan')}>Quản lý đào tạo</button><button className="admin-nav" onClick={() => navigate('/admin/dao-tao?module=phong-hoc')}>Danh mục phòng học</button><button className="admin-nav" onClick={() => navigate('/admin/dao-tao?module=dot-dang-ky')}>Đợt đăng ký</button><button className="admin-nav" onClick={() => navigate('/admin/dao-tao?module=tai-chinh')}>Tài chính sinh viên</button><button className="admin-nav" onClick={() => navigate('/admin/dao-tao?module=nhat-ky')}>Nhật ký hoạt động</button><div className="admin-sidebar-bottom"><div className="admin-profile"><span>AD</span><div><b>Quản trị viên</b><small>admin@edu.vn</small></div></div><button className="admin-logout" onClick={logout}>Đăng xuất <span>↗</span></button></div></aside>
    <main className="admin-main"><header className="admin-topbar"><span>Cổng quản trị <b>/ Quản lý tài khoản</b></span><span className="admin-topbar-user">AD&nbsp; Quản trị viên</span></header>
      <section className="admin-heading"><div><span className="admin-eyebrow">QUẢN TRỊ HỆ THỐNG</span><h1>Quản lý tài khoản</h1><p>Tạo, phân loại và kiểm soát quyền truy cập của người dùng.</p></div><button className="admin-primary" onClick={() => { setEditing(null); setFormOpen(true) }}>＋ Tạo tài khoản</button></section>
      <section className="admin-metrics"><article><span>Tổng tài khoản</span><b>{accounts.length}</b></article><article><span>Đang hoạt động</span><b>{accounts.filter((item) => item.status === 'Hoạt động').length}</b></article><article><span>Đã khóa</span><b>{accounts.filter((item) => item.status === 'Đã khóa').length}</b></article><article><span>Nhóm người dùng</span><b>{GROUPS.length}</b></article></section>
      <section className="admin-table-card"><div className="admin-card-heading"><div><h2>Danh sách người dùng</h2><p>Tra cứu và quản lý quyền truy cập theo vai trò.</p></div><span>{rows.length} tài khoản</span></div><div className="admin-tabs"><button className={group === 'ALL' ? 'selected' : ''} onClick={() => setGroup('ALL')}>Tất cả <b>{accounts.length}</b></button>{GROUPS.map((item) => <button key={item.id} className={group === item.id ? 'selected' : ''} onClick={() => setGroup(item.id)}>{item.label}</button>)}</div><div className="admin-tools"><label><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm mã, họ tên hoặc email…" /></label><button onClick={() => { setQuery(''); setGroup('ALL') }}>Xóa bộ lọc</button></div>
        <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Người dùng</th><th>Mã tài khoản</th><th>Vai trò</th><th>Đơn vị / thông tin</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody>{rows.map((account) => <tr key={account.id}><td><div className="admin-account"><span>{account.name.split(' ').slice(-1)[0][0]}</span><div><b>{account.name}</b><small>{account.email}</small></div></div></td><td>{account.code}</td><td>{GROUPS.find((item) => item.id === account.group)?.label}</td><td>{account.detail}</td><td><span className={`admin-status ${account.status === 'Hoạt động' ? 'enabled' : 'disabled'}`}><i />{account.status}</span></td><td><div className="admin-row-actions"><button onClick={() => setDetail(account)}>Chi tiết</button><button onClick={() => { setEditing(account); setFormOpen(true) }}>Sửa</button><button onClick={() => toggleStatus(account)}>{account.status === 'Hoạt động' ? 'Khóa' : 'Mở khóa'}</button><button className="remove" onClick={() => remove(account)}>Xóa</button></div></td></tr>)}</tbody></table>{!rows.length && <div className="admin-empty">Không tìm thấy tài khoản phù hợp.</div>}</div><footer className="admin-table-foot">Đang hiển thị {rows.length} / {accounts.length} tài khoản</footer></section>
    </main>
    {formOpen && <div className="admin-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setFormOpen(false)}><form className="admin-modal" onSubmit={saveAccount}><header><div><span>TÀI KHOẢN NGƯỜI DÙNG</span><h2>{editing ? 'Cập nhật tài khoản' : 'Tạo tài khoản'}</h2></div><button type="button" onClick={() => { setFormOpen(false); setEditing(null) }}>×</button></header><div className="admin-form-grid"><label>Họ và tên<input name="name" defaultValue={editing?.name || ''} required /></label><label>Email đăng nhập<input name="email" type="email" defaultValue={editing?.email || ''} required /></label><label>Vai trò<select name="group" defaultValue={editing?.group || 'STUDENT'}>{GROUPS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label><label>Đơn vị / thông tin<input name="detail" defaultValue={editing?.detail || ''} placeholder="Khoa, lớp hoặc bộ phận" /></label></div><footer><button type="button" onClick={() => { setFormOpen(false); setEditing(null) }}>Hủy</button><button type="submit">{editing ? 'Lưu thay đổi' : 'Tạo tài khoản'}</button></footer></form></div>}
    {detail && <div className="admin-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setDetail(null)}><section className="admin-modal admin-detail"><header><div><span>THÔNG TIN TÀI KHOẢN</span><h2>{detail.name}</h2></div><button onClick={() => setDetail(null)}>×</button></header><dl><div><dt>Mã tài khoản</dt><dd>{detail.code}</dd></div><div><dt>Email</dt><dd>{detail.email}</dd></div><div><dt>Vai trò</dt><dd>{GROUPS.find((item) => item.id === detail.group)?.label}</dd></div><div><dt>Đơn vị / thông tin</dt><dd>{detail.detail}</dd></div><div><dt>Trạng thái</dt><dd>{detail.status}</dd></div></dl></section></div>}
  </div>
}
