import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import StudentLayout, { Modal, Notice } from '../components/StudentLayout'

const SUBJECTS = [
  { code: 'CSE703006', name: 'Cấu trúc dữ liệu và thuật toán', credits: 3, prerequisite: 'Không', classes: [{ code: 'CSE703006.1', lecturer: 'ThS. Nguyễn Văn Anh', day: 2, periods: '1-3', room: 'B201', current: 38, max: 45 }, { code: 'CSE703006.2', lecturer: 'TS. Trần Minh Hoàng', day: 4, periods: '6-8', room: 'B202', current: 45, max: 45 }] },
  { code: 'CSE702025', name: 'Kỹ thuật phần mềm', credits: 3, prerequisite: 'Cấu trúc dữ liệu và thuật toán', classes: [{ code: 'CSE702025.1', lecturer: 'PGS.TS. Lê Thị Hoa', day: 4, periods: '6-8', room: 'A103', current: 30, max: 45 }] },
  { code: 'CSE702017', name: 'Hệ điều hành', credits: 3, prerequisite: 'Kiến trúc máy tính', classes: [{ code: 'CSE702017.1', lecturer: 'TS. Phạm Đức Nam', day: 6, periods: '3-5', room: 'C301', current: 22, max: 45 }] },
  { code: 'CSE703023', name: 'Kiến trúc máy tính', credits: 3, prerequisite: 'Không', classes: [] },
  { code: 'CSE701010', name: 'Lập trình hướng đối tượng', credits: 3, prerequisite: 'Không', classes: [{ code: 'CSE701010.1', lecturer: 'ThS. Hoàng Thị Lan', day: 3, periods: '1-3', room: 'A201', current: 40, max: 45 }] },
]
const dayName = { 2: 'Thứ 2', 3: 'Thứ 3', 4: 'Thứ 4', 5: 'Thứ 5', 6: 'Thứ 6', 7: 'Thứ 7' }
const readRegistered = () => { try { return JSON.parse(localStorage.getItem('student-registered') || '[]') } catch { return [] } }

export default function DangKyHocPhanPage() {
  const [params, setParams] = useSearchParams(); const initialTab = params.get('tab') === 'registered' ? 'registered' : 'available'
  const [tab, setTab] = useState(initialTab); const [search, setSearch] = useState(''); const [days, setDays] = useState([]); const [expanded, setExpanded] = useState(null); const [registered, setRegistered] = useState(readRegistered); const [confirm, setConfirm] = useState(null); const [notice, setNotice] = useState(null)
  const totalCredits = registered.reduce((total, item) => total + item.credits, 0)
  const filtered = useMemo(() => SUBJECTS.filter((subject) => { const text = `${subject.code} ${subject.name}`.toLowerCase(); const matchesText = text.includes(search.toLowerCase()); const matchesDay = !days.length || subject.classes.some((item) => days.includes(item.day)); return matchesText && matchesDay }), [search, days])
  const chooseTab = (next) => { setTab(next); setParams(next === 'registered' ? { tab: 'registered' } : {}) }
  const flash = (type, message) => { setNotice({ type, message }); window.setTimeout(() => setNotice(null), 3000) }
  const register = (subject, item) => {
    if (item.current >= item.max) return flash('error', 'Lớp học phần đã đủ sĩ số, vui lòng chọn lớp khác.')
    if (registered.some((entry) => entry.code === item.code)) return flash('error', 'Bạn đã đăng ký lớp học phần này trong học kỳ.')
    if (totalCredits + subject.credits > 24) return flash('error', 'Tổng số tín chỉ đăng ký vượt quá giới hạn cho phép.')
    const conflict = registered.find((entry) => entry.day === item.day && entry.periods === item.periods)
    if (conflict) return flash('error', `Lớp học phần trùng lịch với ${conflict.code}.`)
    setConfirm({ type: 'register', subject, item })
  }
  const cancel = (item) => setConfirm({ type: 'cancel', item })
  const confirmAction = () => {
    if (confirm.type === 'register') { const next = [...registered, { ...confirm.item, name: confirm.subject.name, credits: confirm.subject.credits, subjectCode: confirm.subject.code, registeredAt: new Date().toISOString() }]; setRegistered(next); localStorage.setItem('student-registered', JSON.stringify(next)); flash('success', 'Đăng ký lớp học phần thành công.'); setExpanded(null) }
    else { const next = registered.filter((item) => item.code !== confirm.item.code); setRegistered(next); localStorage.setItem('student-registered', JSON.stringify(next)); flash('success', 'Hủy đăng ký lớp học phần thành công.') }
    setConfirm(null)
  }
  return <StudentLayout active={tab === 'registered' ? 'da-dang-ky' : 'dang-ky'} breadcrumb="Đăng ký học phần">
    <div className="student-page-heading"><div><span className="eyebrow">Học kỳ I · Năm học 2026–2027</span><h1>Đăng ký học phần</h1><p>Chọn lớp học phần phù hợp với kế hoạch học tập của bạn.</p></div><div className="round-card"><span>Đợt đăng ký sắp mở</span><strong>Đăng ký học kỳ I</strong><small>20/11/2026 — 15/12/2026</small></div></div>
    {notice && <Notice type={notice.type}>{notice.message}</Notice>}
    <div className="student-stats"><div><span>Số tín chỉ đã đăng ký</span><strong>{totalCredits} / 24</strong></div><div><span>Lớp học phần</span><strong>{registered.length}</strong></div><div><span>Trạng thái học vụ</span><strong>Bình thường</strong></div></div>
    <div className="student-tabs"><button className={tab === 'available' ? 'active' : ''} onClick={() => chooseTab('available')}>Danh sách học phần</button><button className={tab === 'registered' ? 'active' : ''} onClick={() => chooseTab('registered')}>Học phần đã đăng ký <b>{registered.length}</b></button></div>
    {tab === 'available' ? <><section className="filter-panel"><label><span>Từ khóa</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Mã lớp hoặc tên học phần" /></label><div className="day-filter"><span>Ngày học</span><div>{Object.entries(dayName).map(([day, label]) => <button key={day} className={days.includes(Number(day)) ? 'selected' : ''} onClick={() => setDays((old) => old.includes(Number(day)) ? old.filter((value) => value !== Number(day)) : [...old, Number(day)])}>{label}</button>)}</div></div><button className="text-button" onClick={() => { setSearch(''); setDays([]) }}>Xóa bộ lọc</button></section><section className="subject-list"><div className="section-title"><strong>{filtered.length} học phần đang mở</strong><span>Chọn học phần để xem các lớp</span></div>{filtered.map((subject) => <article className={`subject-item ${expanded === subject.code ? 'expanded' : ''}`} key={subject.code}><button className="subject-summary" onClick={() => setExpanded(expanded === subject.code ? null : subject.code)}><span className="expand-icon">{expanded === subject.code ? '−' : '+'}</span><span className="subject-code">{subject.code}</span><span className="subject-name">{subject.name}</span><span className="credit-badge">{subject.credits} TC</span><span className="subject-count">{subject.classes.length} lớp</span></button>{expanded === subject.code && <div className="class-options">{subject.classes.length ? subject.classes.map((item) => <div className="class-option" key={item.code}><div><strong>{item.code}</strong><span>{item.lecturer}</span></div><div><span>{dayName[item.day]} · Tiết {item.periods}</span><span>Phòng {item.room}</span></div><div><span>{item.current}/{item.max} chỗ</span><button className="outline-button" disabled={item.current >= item.max} onClick={() => register(subject, item)}>{item.current >= item.max ? 'Đã đầy' : registered.some((entry) => entry.code === item.code) ? 'Đã đăng ký' : 'Đăng ký'}</button></div></div>) : <div className="empty-row">Học phần này chưa có lớp mở.</div>}</div>}</article>)}</section></> : <RegisteredList registered={registered} onCancel={cancel} />}
    {confirm && <Modal title={confirm.type === 'register' ? 'Xác nhận đăng ký' : 'Xác nhận hủy đăng ký'} onClose={() => setConfirm(null)}><p className="modal-message">{confirm.type === 'register' ? `Bạn có chắc chắn muốn đăng ký lớp ${confirm.item.code} — ${confirm.subject.name}?` : `Bạn có chắc chắn muốn hủy đăng ký lớp ${confirm.item.code} — ${confirm.item.name}?`}</p><div className="modal-actions"><button className="button button-light" onClick={() => setConfirm(null)}>Không</button><button className="button button-dark" onClick={confirmAction}>Xác nhận</button></div></Modal>}
  </StudentLayout>
}

function RegisteredList({ registered, onCancel }) { return <section className="registered-panel"><div className="section-title"><strong>{registered.length} lớp học phần đã đăng ký</strong><span>Dữ liệu được cập nhật sau mỗi thao tác</span></div>{registered.length ? <div className="registered-table-wrap"><table className="student-table"><thead><tr><th>Mã lớp</th><th>Học phần</th><th>Tín chỉ</th><th>Lịch học</th><th>Phòng</th><th /></tr></thead><tbody>{registered.map((item) => <tr key={item.code}><td><strong>{item.code}</strong></td><td>{item.name}</td><td>{item.credits}</td><td>{dayName[item.day]} · Tiết {item.periods}</td><td>{item.room}</td><td><button className="text-button danger" onClick={() => onCancel(item)}>Hủy đăng ký</button></td></tr>)}</tbody></table></div> : <div className="empty-state"><strong>Chưa có học phần đăng ký</strong><span>Hãy chuyển sang danh sách học phần để bắt đầu.</span></div>}</section> }
