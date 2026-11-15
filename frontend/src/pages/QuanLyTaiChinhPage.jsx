import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './QuanLyTaiChinhPage.css'

const initialDebts = [
  { id: 'SV001', name: 'Nguyễn Văn An', className: 'CNTT01', semester: 'HK II · 2025–2026', due: 4050000, paid: 4050000, status: 'Đã hoàn thành' },
  { id: 'SV002', name: 'Trần Thị Bình', className: 'CNTT01', semester: 'HK II · 2025–2026', due: 4050000, paid: 2700000, status: 'Còn công nợ' },
  { id: 'SV003', name: 'Lê Minh Cường', className: 'KTPM02', semester: 'HK II · 2025–2026', due: 5400000, paid: 0, status: 'Chưa thanh toán' },
  { id: 'SV004', name: 'Phạm Thị Dung', className: 'HTTT01', semester: 'HK II · 2025–2026', due: 4050000, paid: 4050000, status: 'Đã hoàn thành' },
  { id: 'SV005', name: 'Hoàng Văn Em', className: 'CNTT02', semester: 'HK II · 2025–2026', due: 4800000, paid: 3200000, status: 'Còn công nợ' },
]
const currency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value)

export default function QuanLyTaiChinhPage() {
  const navigate = useNavigate()
  const session = (() => { try { return JSON.parse(localStorage.getItem('portal-session') || 'null') } catch { return null } })()
  const [debts, setDebts] = useState(initialDebts)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('Tất cả trạng thái')
  const filtered = useMemo(() => debts.filter((item) => `${item.id} ${item.name} ${item.className}`.toLowerCase().includes(query.toLowerCase()) && (status === 'Tất cả trạng thái' || item.status === status)), [debts, query, status])
  const totalDue = debts.reduce((sum, item) => sum + item.due, 0)
  const totalPaid = debts.reduce((sum, item) => sum + item.paid, 0)
  const outstanding = totalDue - totalPaid
  const setPaid = (id, value) => setDebts((current) => current.map((item) => item.id !== id ? item : { ...item, paid: value, status: value >= item.due ? 'Đã hoàn thành' : value > 0 ? 'Còn công nợ' : 'Chưa thanh toán' }))
  const logout = () => { localStorage.removeItem('portal-session'); navigate('/login', { replace: true }) }
  return <div className="finance-page">
    <aside className="finance-sidebar"><a className="finance-brand" href="/tai-chinh"><span>PK</span><div><b>PHENIKAA</b><small>Finance workspace</small></div></a><div className="finance-nav-label">QUẢN LÝ TÀI CHÍNH</div><a className="finance-nav active" href="/tai-chinh">Công nợ học phí</a><div className="finance-sidebar-bottom"><div className="finance-user"><span>{(session?.username || 'TC').slice(0, 2).toUpperCase()}</span><div><b>Quản lý Tài chính</b><small>{session?.email || session?.username || 'taichinh'}</small></div></div><button onClick={logout}>Đăng xuất <span>↗</span></button></div></aside>
    <main className="finance-main"><header className="finance-topbar"><span>Không gian làm việc <b>/ Tài chính</b></span><span className="finance-period">Năm học 2025–2026 <i>⌄</i></span></header>
      <section className="finance-heading"><div><span className="finance-kicker">THEO DÕI HỌC PHÍ</span><h1>Công nợ sinh viên</h1><p>Tra cứu nghĩa vụ học phí và cập nhật số tiền đã nộp theo học kỳ.</p></div><button className="finance-export" onClick={() => window.print()}>↓ <span>Xuất báo cáo</span></button></section>
      <section className="finance-summary"><article className="finance-summary-primary"><span>Tổng phải thu</span><b>{currency(totalDue)}</b><small>Học kỳ II · Năm học 2025–2026</small><i>↗</i></article><article><span>Đã thu</span><b>{currency(totalPaid)}</b><small>{totalDue ? Math.round(totalPaid / totalDue * 100) : 0}% tổng học phí</small><progress className="finance-progress" value={totalDue ? totalPaid / totalDue * 100 : 0} max="100" aria-label="Tỷ lệ học phí đã thu" /></article><article><span>Còn phải thu</span><b>{currency(outstanding)}</b><small>{debts.filter((item) => item.paid < item.due).length} sinh viên còn công nợ</small></article><article><span>Hoàn thành</span><b>{debts.filter((item) => item.paid >= item.due).length}<small> / {debts.length}</small></b><small>Đã hoàn tất nghĩa vụ</small></article></section>
      <section className="finance-card"><div className="finance-card-head"><div><h2>Danh sách học phí</h2><p>Thông tin công nợ theo từng sinh viên</p></div><span className="finance-semester">HỌC KỲ II</span></div><div className="finance-toolbar"><label className="finance-search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm mã sinh viên hoặc họ tên…" /></label><select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Lọc tình trạng công nợ"><option>Tất cả trạng thái</option><option>Đã hoàn thành</option><option>Còn công nợ</option><option>Chưa thanh toán</option></select></div>
        <div className="finance-table-wrap"><table className="finance-table"><thead><tr><th>Sinh viên</th><th>Lớp</th><th>Học kỳ</th><th>Phải thu</th><th>Đã nộp</th><th>Còn lại</th><th>Trạng thái</th><th /></tr></thead><tbody>{filtered.map((item) => <tr key={item.id}><td><div className="finance-student"><span>{item.name.split(' ').slice(-1)[0].slice(0, 1)}{item.name.split(' ')[1]?.slice(0, 1)}</span><div><b>{item.name}</b><small>{item.id}</small></div></div></td><td>{item.className}</td><td>{item.semester}</td><td>{currency(item.due)}</td><td>{currency(item.paid)}</td><td className={item.paid < item.due ? 'finance-remaining' : ''}>{currency(Math.max(item.due - item.paid, 0))}</td><td><span className={`finance-status ${item.paid >= item.due ? 'complete' : item.paid ? 'partial' : 'unpaid'}`}><i />{item.status}</span></td><td><button className="finance-update" onClick={() => { const entered = window.prompt(`Số tiền đã nộp của ${item.id} (VND)`, String(item.paid)); if (entered !== null && Number.isFinite(Number(entered)) && Number(entered) >= 0) setPaid(item.id, Math.min(Number(entered), item.due)) }}>Cập nhật</button></td></tr>)}</tbody></table>{!filtered.length && <div className="finance-empty">Không tìm thấy hồ sơ phù hợp.</div>}</div><footer className="finance-foot">{filtered.length} hồ sơ <span>· Dữ liệu hiển thị theo học kỳ đang chọn</span></footer></section>
      <p className="finance-note"><b>Thông tin:</b> Phân hệ chỉ theo dõi trạng thái học phí; không xử lý giao dịch thanh toán trực tuyến.</p>
    </main>
  </div>
}
