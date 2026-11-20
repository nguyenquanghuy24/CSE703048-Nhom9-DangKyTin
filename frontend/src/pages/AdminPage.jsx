import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AddMethodChooser from '../components/AddMethodChooser'
import ExcelImportModal from '../components/ExcelImportModal'
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
  { id: 1, code: 'SV001', name: 'Nguyễn Văn An', phone: '0901000001', email: 'an.nv@edu.vn', group: 'STUDENT', detail: 'CNTT01 · Khóa 2022', cohort: '2022', className: 'CNTT01', major: 'Công nghệ thông tin', faculty: 'Công nghệ thông tin', status: 'Hoạt động' },
  { id: 2, code: 'SV002', name: 'Trần Thị Bình', phone: '0901000002', email: 'binh.tt@edu.vn', group: 'STUDENT', detail: 'CNTT01 · Khóa 2022', cohort: '2022', className: 'CNTT01', major: 'Công nghệ thông tin', faculty: 'Công nghệ thông tin', status: 'Hoạt động' },
  { id: 3, code: 'NV101', name: 'Bùi Thị Quỳnh', phone: '0902000001', email: 'pdt@edu.vn', group: 'TRAINING', detail: 'Phòng Đào tạo', department: 'Phòng Đào tạo', position: 'Chuyên viên', status: 'Hoạt động' },
  { id: 4, code: 'NV201', name: 'Nguyễn Mạnh Hùng', phone: '0902000002', email: 'khoa@edu.vn', group: 'DEPARTMENT', detail: 'Khoa CNTT', faculty: 'Khoa CNTT', major: 'Kỹ thuật phần mềm', programIds: ['480201-2023', '480103-2023', '480107-2025'], position: 'Quản lý Khoa/Ngành', status: 'Hoạt động' },
  { id: 5, code: 'NV301', name: 'Lê Minh Châu', phone: '0902000003', email: 'csvc@edu.vn', group: 'FACILITIES', detail: 'Cơ sở vật chất', department: 'Cơ sở vật chất', position: 'Chuyên viên', status: 'Hoạt động' },
  { id: 6, code: 'NV401', name: 'Hoàng Thu Hà', phone: '0902000004', email: 'taichinh@edu.vn', group: 'FINANCE', detail: 'Phòng Tài chính', department: 'Phòng Tài chính', position: 'Chuyên viên', status: 'Hoạt động' },
  { id: 7, code: 'AD001', name: 'Quản trị hệ thống', phone: '', email: 'admin@edu.vn', group: 'ADMIN', detail: 'Quản trị viên', position: 'Quản trị viên', status: 'Hoạt động' },
]
const seedAudit = [
  { id: 1, time: '15/11/2026 09:42', user: 'admin@edu.vn', action: 'Cập nhật tài khoản', target: 'SV001', result: 'Thành công' },
  { id: 2, time: '15/11/2026 09:18', user: 'admin@edu.vn', action: 'Đăng nhập hệ thống', target: 'Quản trị viên', result: 'Thành công' },
  { id: 3, time: '14/11/2026 16:35', user: 'admin@edu.vn', action: 'Mở khóa tài khoản', target: 'NV201', result: 'Thành công' },
]

export default function AdminPage() {
  const navigate = useNavigate()
  const session = (() => { try { return JSON.parse(localStorage.getItem('portal-session') || 'null') } catch { return null } })()
  const sessionName = session?.username || 'admin'
  const sessionAvatar = sessionName.slice(0, 2).toUpperCase()
  const [activeSection, setActiveSection] = useState('accounts')
  const [accounts, setAccounts] = useState(seedAccounts)
  const [auditLogs, setAuditLogs] = useState(seedAudit)
  const [group, setGroup] = useState('ALL')
  const [query, setQuery] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [formRole, setFormRole] = useState('STUDENT')
  const [entryChoice, setEntryChoice] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [detail, setDetail] = useState(null)
  const rows = useMemo(() => accounts.filter((account) => (group === 'ALL' || account.group === group) && `${account.code} ${account.name} ${account.email} ${account.phone || ''} ${account.detail || ''} ${account.faculty || ''} ${account.department || ''} ${account.major || ''} ${account.className || ''}`.toLowerCase().includes(query.toLowerCase())), [accounts, group, query])
  const recordActivity = (action, target) => setAuditLogs((current) => [{ id: Date.now(), time: new Date().toLocaleString('vi-VN'), user: session?.email || sessionName, action, target, result: 'Thành công' }, ...current])
  const logout = () => { localStorage.removeItem('portal-session'); navigate('/login', { replace: true }) }
  const saveAccount = (event) => {
    event.preventDefault()
    const data = Object.fromEntries(new FormData(event.currentTarget))
    if (data.programIds !== undefined) data.programIds = data.programIds.split(',').map((value) => value.trim()).filter(Boolean)
    if (accounts.some((item) => item.id !== editing?.id && (item.code.toLowerCase() === data.code.trim().toLowerCase() || item.email.toLowerCase() === data.email.trim().toLowerCase()))) { window.alert('Mã sinh viên/nhân viên hoặc email đã tồn tại. Vui lòng kiểm tra lại.'); return }
    if (editing) {
      setAccounts((current) => current.map((item) => item.id === editing.id ? { ...item, ...data, detail: data.detail || data.department || data.faculty || data.className || '' } : item))
      recordActivity('Cập nhật tài khoản', editing.code)
      setFormOpen(false)
      setEditing(null)
      return
    }
    const role = GROUPS.find((item) => item.id === data.group)
    const id = Math.max(0, ...accounts.map((item) => item.id)) + 1
    setAccounts((current) => [...current, { id, ...data, code: data.code || `${role.prefix}${String(id).padStart(3, '0')}`, detail: data.detail || data.department || data.faculty || data.className || role.label, status: data.status || 'Hoạt động' }])
    recordActivity('Tạo tài khoản', data.email)
    setFormOpen(false)
  }
  const toggleStatus = (account) => { const action = account.status === 'Hoạt động' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'; setAccounts((current) => current.map((item) => item.id === account.id ? { ...item, status: item.status === 'Hoạt động' ? 'Đã khóa' : 'Hoạt động' } : item)); recordActivity(action, account.code) }
  const remove = (account) => { if (window.confirm(`Xóa tài khoản ${account.email}?`)) { setAccounts((current) => current.filter((item) => item.id !== account.id)); recordActivity('Xóa tài khoản', account.code) } }
  const importAccounts = (items) => {
    const firstId = Math.max(0, ...accounts.map((account) => account.id)) + 1
    const imported = items.map((item, index) => {
      const role = GROUPS.find((groupItem) => groupItem.id === (item.group || group))
      return { id: firstId + index, ...item, password: 'Default@123', code: item.code || `${role.prefix}${String(firstId + index).padStart(3, '0')}`, group: role.id, detail: item.detail || item.department || item.faculty || item.className || role.label, status: item.status || 'Hoạt động' }
    })
    setAccounts((current) => [...current, ...imported])
    recordActivity('Nhập tài khoản bằng Excel', `${imported.length} tài khoản`)
  }
  const normalizeRole = (value) => String(value || '').trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().replace(/[^a-z0-9]/g, '')
  const accountImportFields = [
    { key: 'code', label: 'Mã sinh viên / nhân viên', required: true, example: group === 'STUDENT' ? 'SV003' : 'NV501' },
    { key: 'name', label: 'Họ và tên', required: true, example: 'Nguyễn Văn An' },
    { key: 'dateOfBirth', label: 'Ngày sinh', required: group !== 'ALL', example: '01/01/2004' },
    { key: 'gender', label: 'Giới tính', required: group !== 'ALL', example: 'Nam' },
    { key: 'phone', label: 'Số điện thoại', required: true, example: '0901234567' },
    { key: 'email', label: 'Email', required: true, example: 'an.nv@edu.vn' },
    ...(group === 'ALL' ? [{ key: 'group', label: 'Vai trò', required: true, example: 'STUDENT', aliases: ['Nhóm người dùng'], parse: (value) => GROUPS.find((role) => normalizeRole(role.id) === normalizeRole(value) || normalizeRole(role.label) === normalizeRole(value))?.id || '' }] : []),
    ...((group === 'STUDENT' || group === 'ALL') ? [{ key: 'cohort', label: 'Khóa học', required: group === 'STUDENT', example: '2022' }, { key: 'className', label: 'Lớp', required: group === 'STUDENT', example: 'CNTT01' }] : []),
    ...(['STUDENT', 'DEPARTMENT', 'ALL'].includes(group) ? [{ key: 'major', label: group === 'STUDENT' ? 'Ngành học' : 'Ngành phụ trách / theo học', required: group !== 'ALL', example: 'Công nghệ thông tin' }, { key: 'faculty', label: group === 'STUDENT' ? 'Khoa theo học' : 'Khoa phụ trách / theo học', required: group !== 'ALL', example: 'Công nghệ thông tin' }] : []),
    ...(['TRAINING', 'FACILITIES', 'FINANCE', 'ALL'].includes(group) ? [{ key: 'department', label: 'Bộ phận', required: ['TRAINING', 'FACILITIES', 'FINANCE'].includes(group), example: 'Phòng Đào tạo' }] : []),
    ...(group !== 'STUDENT' ? [{ key: 'position', label: 'Chức vụ', required: group !== 'ALL', example: 'Chuyên viên' }] : []),
    { key: 'status', label: 'Trạng thái', example: 'Hoạt động' },
  ]

  return <div className="admin-page">
    <aside className="admin-sidebar"><a className="admin-brand" href="/admin"><span>P</span><div><b>P.K.A</b><small>Academic portal</small></div></a><div className="admin-menu-caption">QUẢN TRỊ HỆ THỐNG</div><button className={`admin-nav ${activeSection === 'accounts' ? 'active' : ''}`} onClick={() => setActiveSection('accounts')}>Quản lý tài khoản</button><button className={`admin-nav ${activeSection === 'audit' ? 'active' : ''}`} onClick={() => setActiveSection('audit')}>Nhật ký hoạt động</button><div className="admin-sidebar-bottom"><div className="admin-profile"><span>{sessionAvatar}</span><div><b>Quản trị viên</b><small>{session?.email || sessionName}</small></div></div><button className="admin-logout" onClick={logout}>Đăng xuất <span>↗</span></button></div></aside>
    <main className="admin-main"><header className="admin-topbar"><span>Cổng quản trị <b>/ {activeSection === 'accounts' ? 'Quản lý tài khoản' : 'Nhật ký hoạt động'}</b></span></header>
      <div hidden={activeSection !== 'accounts'}>
      <section className="admin-heading"><div><span className="admin-eyebrow">QUẢN TRỊ HỆ THỐNG</span><h1>Quản lý tài khoản</h1><p>Tạo, phân loại và kiểm soát quyền truy cập của người dùng.</p></div><button className="admin-primary" onClick={() => setEntryChoice(true)}>＋ Tạo tài khoản</button></section>
      <section className="admin-metrics"><article><span>Tổng tài khoản</span><b>{accounts.length}</b></article><article><span>Đang hoạt động</span><b>{accounts.filter((item) => item.status === 'Hoạt động').length}</b></article><article><span>Đã khóa</span><b>{accounts.filter((item) => item.status === 'Đã khóa').length}</b></article><article><span>Nhóm người dùng</span><b>{GROUPS.length}</b></article></section>
      <section className="admin-table-card"><div className="admin-card-heading"><div><h2>Danh sách người dùng</h2><p>Tra cứu và quản lý quyền truy cập theo vai trò.</p></div><span>{rows.length} tài khoản</span></div><div className="admin-tabs"><button className={group === 'ALL' ? 'selected' : ''} onClick={() => setGroup('ALL')}>Tất cả <b>{accounts.length}</b></button>{GROUPS.map((item) => <button key={item.id} className={group === item.id ? 'selected' : ''} onClick={() => setGroup(item.id)}>{item.label}</button>)}</div><div className="admin-tools"><label><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm mã, họ tên hoặc email…" /></label><button onClick={() => { setQuery(''); setGroup('ALL') }}>Xóa bộ lọc</button></div>
        <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Người dùng</th><th>Mã sinh viên / nhân viên</th><th>Số điện thoại</th><th>Vai trò</th><th>Khoa / bộ phận / lớp</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody>{rows.map((account) => <tr key={account.id}><td><div className="admin-account"><span>{account.name.split(' ').slice(-1)[0][0]}</span><div><b>{account.name}</b><small>{account.email}</small></div></div></td><td>{account.code}</td><td>{account.phone || '—'}</td><td>{GROUPS.find((item) => item.id === account.group)?.label}</td><td>{[account.className, account.major, account.faculty, account.programIds?.join(', '), account.department, account.position].filter(Boolean).join(' · ') || account.detail}</td><td><span className={`admin-status ${account.status === 'Hoạt động' ? 'enabled' : 'disabled'}`}><i />{account.status}</span></td><td><div className="admin-row-actions"><button onClick={() => setDetail(account)}>Chi tiết</button><button onClick={() => { setEditing(account); setFormRole(account.group); setFormOpen(true) }}>Sửa</button><button onClick={() => toggleStatus(account)}>{account.status === 'Hoạt động' ? 'Khóa' : 'Mở khóa'}</button><button className="remove" onClick={() => remove(account)}>Xóa</button></div></td></tr>)}</tbody></table>{!rows.length && <div className="admin-empty">Không tìm thấy tài khoản phù hợp.</div>}</div><footer className="admin-table-foot">Đang hiển thị {rows.length} / {accounts.length} tài khoản</footer></section>
      </div>
      <div hidden={activeSection !== 'audit'}>
        <section className="admin-heading"><div><span className="admin-eyebrow">TRUY VẾT HỆ THỐNG</span><h1>Nhật ký hoạt động</h1><p>Ghi nhận thao tác quản trị tài khoản để phục vụ tra soát.</p></div></section>
        <section className="admin-table-card"><div className="admin-card-heading"><div><h2>Lịch sử thao tác</h2><p>{auditLogs.length} sự kiện được ghi nhận</p></div></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Thời gian</th><th>Tài khoản thực hiện</th><th>Thao tác</th><th>Đối tượng</th><th>Kết quả</th></tr></thead><tbody>{auditLogs.map((entry) => <tr key={entry.id}><td>{entry.time}</td><td>{entry.user}</td><td>{entry.action}</td><td>{entry.target}</td><td>{entry.result}</td></tr>)}</tbody></table>{!auditLogs.length && <div className="admin-empty">Chưa có hoạt động nào được ghi nhận.</div>}</div></section>
      </div>
    </main>
    {formOpen && <div className="admin-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setFormOpen(false)}><form className="admin-modal" onSubmit={saveAccount}><header><div><span>TÀI KHOẢN NGƯỜI DÙNG</span><h2>{editing ? 'Cập nhật tài khoản' : 'Tạo tài khoản'}</h2></div><button type="button" onClick={() => { setFormOpen(false); setEditing(null) }}>×</button></header><div className="admin-form-grid"><label>Vai trò<select name="group" value={formRole} onChange={(event) => setFormRole(event.target.value)}>{GROUPS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label><label>Mã sinh viên / nhân viên<input name="code" defaultValue={editing?.code || ''} required /></label><label>Họ và tên<input name="name" defaultValue={editing?.name || ''} required /></label><label>Ngày sinh<input name="dateOfBirth" type="date" defaultValue={editing?.dateOfBirth || ''} required /></label><label>Giới tính<select name="gender" defaultValue={editing?.gender || ''} required><option value="">Chọn</option><option>Nam</option><option>Nữ</option><option>Khác</option></select></label><label>Số điện thoại<input name="phone" defaultValue={editing?.phone || ''} required /></label><label>Email đăng nhập<input name="email" type="email" defaultValue={editing?.email || ''} required /></label>{formRole === 'STUDENT' ? <><label>Khóa học<input name="cohort" defaultValue={editing?.cohort || ''} required /></label><label>Lớp<input name="className" defaultValue={editing?.className || ''} required /></label><label>Ngành học<input name="major" defaultValue={editing?.major || ''} required /></label><label>Khoa theo học<input name="faculty" defaultValue={editing?.faculty || ''} required /></label></> : formRole === 'DEPARTMENT' ? <><label>Khoa phụ trách<input name="faculty" defaultValue={editing?.faculty || ''} required /></label><label>Ngành chính<input name="major" defaultValue={editing?.major || ''} required /></label><label className="wide">Mã CTĐT phụ trách<input name="programIds" defaultValue={editing?.programIds?.join(', ') || ''} placeholder="480201-2023, 480103-2023" required /></label><label>Chức vụ<input name="position" defaultValue={editing?.position || ''} required /></label></> : <><label>Bộ phận<input name="department" defaultValue={editing?.department || ''} required={formRole !== 'ADMIN'} /></label><label>Chức vụ<input name="position" defaultValue={editing?.position || ''} required /></label></>}{!editing && <label>Mật khẩu ban đầu<input name="password" type="password" required minLength="6" /></label>}<label>Trạng thái<select name="status" defaultValue={editing?.status || 'Hoạt động'}><option>Hoạt động</option><option>Đã khóa</option></select></label></div><footer><button type="button" onClick={() => { setFormOpen(false); setEditing(null) }}>Hủy</button><button type="submit">{editing ? 'Lưu thay đổi' : 'Tạo tài khoản'}</button></footer></form></div>}
    {entryChoice && <AddMethodChooser title="Tạo tài khoản" onClose={() => setEntryChoice(false)} onManual={() => { setEntryChoice(false); setEditing(null); setFormRole(group === 'ALL' ? 'STUDENT' : group); setFormOpen(true) }} onExcel={() => { setEntryChoice(false); setImportOpen(true) }} />}
    {importOpen && <ExcelImportModal title="Nhập danh sách tài khoản" hint="Tài khoản nhập bằng Excel được gán mật khẩu ban đầu Default@123." fields={accountImportFields} onClose={() => setImportOpen(false)} onImport={importAccounts} />}
    {detail && <div className="admin-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setDetail(null)}><section className="admin-modal admin-detail"><header><div><span>THÔNG TIN TÀI KHOẢN</span><h2>{detail.name}</h2></div><button onClick={() => setDetail(null)}>×</button></header><dl>{[['Mã sinh viên / nhân viên', detail.code], ['Ngày sinh', detail.dateOfBirth], ['Giới tính', detail.gender], ['Số điện thoại', detail.phone], ['Email', detail.email], ['Vai trò', GROUPS.find((item) => item.id === detail.group)?.label], ['Khóa học', detail.cohort], ['Lớp', detail.className], ['Ngành', detail.major], ['Mã CTĐT phụ trách', detail.programIds?.join(', ')], ['Khoa', detail.faculty], ['Bộ phận', detail.department], ['Chức vụ', detail.position], ['Trạng thái', detail.status]].filter(([, value]) => value).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></section></div>}
  </div>
}

