import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import StudentLayout, { Modal, Notice } from '../components/StudentLayout'
import { COURSES, DEFAULT_SEMESTER_ID, DEMO_STUDENT, PROGRAMS, SEMESTERS } from '../constants/academicCatalog'

const DAYS = { 2: 'Thứ 2', 3: 'Thứ 3', 4: 'Thứ 4', 5: 'Thứ 5', 6: 'Thứ 6', 7: 'Thứ 7' }
const readRegistered = () => { try { return JSON.parse(localStorage.getItem('student-registered') || '[]') } catch { return [] } }

function getEligibility(course, section, program, semester, registered, credits) {
  if (!course.programMappingAvailable) return 'Workbook chưa có ma trận học phần thuộc từng CTĐT để xác nhận quyền đăng ký.'
  if (!program || !course.programIds.includes(program.id)) return 'Học phần không thuộc chương trình đào tạo của sinh viên.'
  if (!course.semesterIds.includes(semester.id) || section.semesterId !== semester.id) return 'Lớp trong workbook chưa được gắn với học kỳ đã chọn.'
  if (semester.status !== 'Đang mở') return 'Đợt đăng ký của học kỳ này chưa mở hoặc đã đóng.'
  if (DEMO_STUDENT.academicStatus !== 'Bình thường') return 'Chưa có dữ liệu học vụ để xác nhận điều kiện đăng ký.'
  const debtStatus = DEMO_STUDENT.debtBySemester[semester.sourceLabel]
  if (program.requiresNoDebt && !debtStatus) return 'Chưa có dữ liệu công nợ cho học kỳ đã chọn.'
  if (program.requiresNoDebt && debtStatus !== 'Đủ điều kiện') return 'Sinh viên còn công nợ học phí.'
  if (registered.some((entry) => entry.semesterId === semester.id && (entry.subjectCode === course.code || entry.code === section.code))) return 'Đã đăng ký học phần này trong học kỳ.'
  if (!course.prerequisiteDataAvailable || !DEMO_STUDENT.transcriptAvailable) return 'Chưa có dữ liệu tiên quyết/kết quả học tập để xác nhận điều kiện.'
  const missingPrerequisite = course.prerequisites.find((code) => !DEMO_STUDENT.passedCourses.includes(code))
  if (missingPrerequisite) return `Chưa hoàn thành học phần tiên quyết ${missingPrerequisite}.`
  if (program.maxCredits && credits + course.credits > program.maxCredits) return `Vượt giới hạn ${program.maxCredits} tín chỉ của chương trình.`
  const [start, end] = section.periods.split('-').map(Number)
  const conflict = registered.find((entry) => {
    if (entry.semesterId !== semester.id || Number(entry.day) !== Number(section.day)) return false
    const [entryStart, entryEnd] = String(entry.periods).split('-').map(Number)
    return start <= entryEnd && entryStart <= end
  })
  if (conflict) return `Trùng lịch với lớp ${conflict.code}.`
  const enrolledCount = registered.filter((entry) => entry.semesterId === semester.id && entry.code === section.code).length
  if (section.current + enrolledCount >= section.max) return 'Lớp đã đủ sĩ số.'
  return ''
}

export default function DangKyHocPhanPage() {
  const [params, setParams] = useSearchParams()
  const [tab, setTab] = useState(params.get('tab') === 'registered' ? 'registered' : 'available')
  const semesterId = DEFAULT_SEMESTER_ID
  const programId = DEMO_STUDENT.programId
  const [query, setQuery] = useState('')
  const [day, setDay] = useState('all')
  const [expanded, setExpanded] = useState(null)
  const [allRegistered, setAllRegistered] = useState(readRegistered)
  const [confirm, setConfirm] = useState(null)
  const [notice, setNotice] = useState(null)

  const semester = SEMESTERS.find((item) => item.id === semesterId) || SEMESTERS[0]
  const studentProgram = PROGRAMS.find((item) => item.id === DEMO_STUDENT.programId)
  const registered = allRegistered.filter((entry) => (entry.semesterId || DEFAULT_SEMESTER_ID) === semesterId)
  const credits = registered.reduce((sum, entry) => sum + Number(entry.credits || 0), 0)
  const filteredCourses = useMemo(() => COURSES.filter((course) => {
    const programMatches = course.programIds.includes(programId)
    const sections = course.classes.filter((item) => item.status === 'Đã duyệt')
    const haystack = `${course.code} ${course.name} ${course.block} ${sections.map((item) => `${item.code} ${item.lecturer} ${item.room} ${DAYS[item.day]} ${item.periods}`).join(' ')}`.toLocaleLowerCase('vi')
    return programMatches && (!day || day === 'all' || sections.some((item) => String(item.day) === day)) && haystack.includes(query.trim().toLocaleLowerCase('vi'))
  }), [programId, day, query])

  const flash = (type, message) => { setNotice({ type, message }); window.setTimeout(() => setNotice(null), 3500) }
  const chooseTab = (next) => { setTab(next); setParams(next === 'registered' ? { tab: 'registered' } : {}) }
  const requestRegister = (course, section) => {
    const reason = getEligibility(course, section, studentProgram, semester, registered, credits)
    if (reason) return flash('error', reason)
    setConfirm({ type: 'register', course, section })
  }
  const requestCancel = (entry) => {
    if (semester.status !== 'Đang mở') return flash('error', 'Đợt đăng ký đã đóng; không thể hủy lớp trong học kỳ này.')
    setConfirm({ type: 'cancel', entry })
  }
  const confirmAction = () => {
    let next
    if (confirm.type === 'register') {
      const { course, section } = confirm
      next = [...allRegistered, { ...section, name: course.name, credits: course.credits, subjectCode: course.code, facultyId: studentProgram.facultyId, majorId: studentProgram.majorId, programId: studentProgram.id, semesterId, registeredAt: new Date().toISOString() }]
      flash('success', `Đã đăng ký ${course.code} trong ${semester.label}.`)
    } else {
      next = allRegistered.filter((entry) => !(entry.code === confirm.entry.code && (entry.semesterId || SEMESTERS[0].id) === semesterId))
      flash('success', `Đã hủy lớp ${confirm.entry.code} trong ${semester.label}.`)
    }
    setAllRegistered(next)
    localStorage.setItem('student-registered', JSON.stringify(next))
    setConfirm(null)
  }

  return <StudentLayout active={tab === 'registered' ? 'da-dang-ky' : 'dang-ky'} breadcrumb="Đăng ký học phần">
    <div className="student-page-heading"><div><span className="eyebrow">Cổng đăng ký · {semester.label}</span><h1>Đăng ký học phần</h1><p>Tra cứu lớp theo khoa, ngành và chương trình đào tạo.</p></div><div className="round-card"><span>Đợt đăng ký</span><strong>{semester.status}</strong><small>{new Date(semester.startsAt).toLocaleDateString('vi-VN')} — {new Date(semester.endsAt).toLocaleDateString('vi-VN')}</small></div></div>
    {notice && <Notice type={notice.type}>{notice.message}</Notice>}
    <section className="student-stats"><div><span>Sinh viên</span><strong>{DEMO_STUDENT.id} · {DEMO_STUDENT.name}</strong></div><div><span>Chương trình đang theo học</span><strong>{studentProgram?.major} · Khóa {studentProgram?.cohort}</strong></div><div><span>Tín chỉ kỳ này / giới hạn CTĐT</span><strong>{credits} / {studentProgram?.maxCredits ?? 'Chưa có dữ liệu'}</strong></div></section>
    <div className="student-tabs"><button className={tab === 'available' ? 'active' : ''} onClick={() => chooseTab('available')}>Học phần và lớp được duyệt <b>{filteredCourses.length}</b></button><button className={tab === 'registered' ? 'active' : ''} onClick={() => chooseTab('registered')}>Đã đăng ký <b>{registered.length}</b></button></div>
    {tab === 'available' ? <>
      <section className="filter-panel"><label><span>Tìm học phần, mã lớp, giảng viên hoặc phòng</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ví dụ: CSE201003, Nguyễn Minh An, A1-203" /></label><label><span>Ngày học</span><select value={day} onChange={(event) => setDay(event.target.value)}><option value="all">Tất cả các ngày</option>{Object.entries(DAYS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><button className="text-button" onClick={() => { setQuery(''); setDay('all') }}>Xóa bộ lọc</button></section>
      <section className="subject-list"><div className="section-title"><strong>{filteredCourses.length} học phần phù hợp</strong><span>{semester.label} · {COURSES.length} học phần từ workbook</span></div>{filteredCourses.map((course) => {
        const courseProgram = PROGRAMS.find((item) => item.id === programId) || studentProgram
        const sections = course.classes.filter((item) => item.status === 'Đã duyệt')
        return <article className={`subject-item ${expanded === course.code ? 'expanded' : ''}`} key={course.code}><button className="subject-summary" onClick={() => setExpanded(expanded === course.code ? null : course.code)}><span className="expand-icon">{expanded === course.code ? '−' : '+'}</span><span className="subject-code">{course.code}</span><span className="subject-name">{course.name}</span><span className="credit-badge">{course.credits} TC</span><span className="subject-count">{sections.length} lớp · {course.block}</span></button>{expanded === course.code && <div className="class-options">{sections.length ? sections.map((section) => {
          const reason = getEligibility(course, section, studentProgram, semester, registered, credits)
          const isAlreadyRegistered = registered.some((entry) => entry.subjectCode === course.code || entry.code === section.code)
          return <div className="class-option" key={section.code}><div><strong>{section.code}</strong><span>{section.lecturer}</span></div><div><span>{DAYS[section.day]} · Tiết {section.periods}</span><span>Phòng {section.room}</span><span>{section.current}/{section.max} chỗ</span></div><div><span>{isAlreadyRegistered ? 'Đã đăng ký học phần' : reason || 'Đủ điều kiện đăng ký'}</span><button className="outline-button" disabled={Boolean(reason)} onClick={() => requestRegister(course, section)}>{isAlreadyRegistered ? 'Đã đăng ký' : reason ? 'Không đủ điều kiện' : 'Đăng ký'}</button></div></div>
        }) : <div className="empty-row">Chưa có lớp liên kết với học phần này.</div>}<div className="empty-row">Khoa phụ trách: {course.faculty} · Ngành đang lọc: {courseProgram?.major || 'Tất cả'} · Tiên quyết: chưa có dữ liệu nguồn</div></div>}</article>
      })}{!filteredCourses.length && <div className="empty-state"><strong>Không tìm thấy học phần</strong><span>Thử đổi khoa, ngành, học kỳ hoặc điều kiện tìm kiếm.</span></div>}</section>
    </> : <section className="registered-panel"><div className="section-title"><strong>{registered.length} lớp đã đăng ký</strong><span>{semester.label} · {credits} tín chỉ</span></div>{registered.length ? <div className="registered-table-wrap"><table className="student-table"><thead><tr><th>Mã lớp</th><th>Mã học phần</th><th>Học phần</th><th>Tín chỉ</th><th>Lịch học</th><th>Phòng</th><th /></tr></thead><tbody>{registered.map((entry) => <tr key={`${entry.code}-${entry.semesterId}`}><td><strong>{entry.code}</strong></td><td>{entry.subjectCode}</td><td>{entry.name}</td><td>{entry.credits}</td><td>{DAYS[entry.day]} · Tiết {entry.periods}</td><td>{entry.room}</td><td><button className="text-button danger" onClick={() => requestCancel(entry)}>Hủy đăng ký</button></td></tr>)}</tbody></table></div> : <div className="empty-state"><strong>Chưa có lớp đăng ký trong kỳ này</strong><span>Chọn “Danh mục lớp mở” để xem học phần phù hợp với CTĐT của bạn.</span></div>}</section>}
    {confirm && <Modal title={confirm.type === 'register' ? 'Xác nhận đăng ký' : 'Xác nhận hủy'} onClose={() => setConfirm(null)}><p className="modal-message">{confirm.type === 'register' ? `Đăng ký lớp ${confirm.section.code} – ${confirm.course.name} (${confirm.course.credits} TC) trong ${semester.label}?` : `Hủy lớp ${confirm.entry.code} – ${confirm.entry.name} trong ${semester.label}?`}</p><div className="modal-actions"><button className="button button-light" onClick={() => setConfirm(null)}>Quay lại</button><button className="button button-dark" onClick={confirmAction}>Xác nhận</button></div></Modal>}
  </StudentLayout>
}
