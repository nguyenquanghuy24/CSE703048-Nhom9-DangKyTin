import source from './sourceData.json'

const majorFaculty = {
  '480201': 'Khoa CNTT',
  '480103': 'Khoa CNTT',
  '480107': 'Khoa CNTT',
  '340101': 'Khoa Kinh tế',
  '340201': 'Khoa Kinh tế',
}

export const FACULTIES = [...new Set(source.hocPhan.map((row) => row['Khoa phụ trách']).filter(Boolean))].map((name, index) => ({ id: `faculty-${index + 1}`, name }))
const facultyIdByName = Object.fromEntries(FACULTIES.map((faculty) => [faculty.name, faculty.id]))

export const PROGRAMS = [...new Map(source.sinhVien.map((row) => {
  const code = String(row['Mã ngành'] || '')
  const cohort = String(row['Khóa nhập học'] || '')
  const facultyName = majorFaculty[code] || 'Chưa xác định Khoa phụ trách'
  const item = { id: `${code}-${cohort}`, code, cohort, facultyId: facultyIdByName[facultyName], facultyName, major: row['Ngành'], name: `${row['Ngành']} · khóa ${cohort}`, maxCredits: null, requiresNoDebt: true }
  return [item.id, item]
})).values()]

const programIdsByFaculty = (facultyName) => PROGRAMS.filter((program) => program.facultyName === facultyName).map((program) => program.id)
const schedulePattern = /Thứ\s*(\d+)\s*[·.]\s*Tiết\s*(\d+)\s*[-–]\s*(\d+)/i
const parseEnrollment = (value = '') => {
  const [current, max] = String(value).split('/').map((part) => Number(part.trim()))
  return { current: Number.isFinite(current) ? current : 0, max: Number.isFinite(max) ? max : 0 }
}

export const COURSES = source.hocPhan.map((row) => {
  const classes = source.lopHocPhan.filter((section) => section['Học phần'] === row['Tên']).map((section) => {
    const schedule = String(section['Lịch học'] || '').match(schedulePattern)
    return {
      code: String(section['Mã'] || ''),
      lecturer: String(section['Giảng viên'] || ''),
      day: schedule ? Number(schedule[1]) : null,
      periods: schedule ? `${schedule[2]}-${schedule[3]}` : '',
      room: String(section['Phòng'] || ''),
      ...parseEnrollment(section['Sĩ số']),
      status: String(section['Trạng thái'] || ''),
      semesterId: 'unassigned',
    }
  })
  return {
    code: String(row['Mã'] || ''),
    name: String(row['Tên'] || ''),
    credits: Number(row['Số tín chỉ'] || 0),
    faculty: String(row['Khoa phụ trách'] || ''),
    facultyId: facultyIdByName[String(row['Khoa phụ trách'] || '')],
    status: String(row['Trạng thái'] || ''),
    block: 'Chưa phân loại khối kiến thức',
    programIds: programIdsByFaculty(String(row['Khoa phụ trách'] || '')),
    programMappingAvailable: false,
    prerequisites: [],
    prerequisiteDataAvailable: false,
    semesterIds: [],
    classes,
  }
})

const toIsoDate = (value) => {
  const match = String(value || '').match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  return match ? `${match[3]}-${match[2]}-${match[1]}` : ''
}
const semesterLabel = (value) => String(value || '').replace(/^HK\s*/, 'Học kỳ ').replace(/\s*-\s*/g, ' · Năm học ')
export const SEMESTERS = source.dotDangKy.map((row) => ({
  id: String(row['Mã'] || ''),
  name: String(row['Tên'] || ''),
  label: semesterLabel(row['Học kỳ']),
  sourceLabel: String(row['Học kỳ'] || ''),
  startsAt: toIsoDate(row['Bắt đầu']),
  endsAt: toIsoDate(row['Kết thúc']),
  status: String(row['Trạng thái'] || ''),
}))
export const DEFAULT_SEMESTER_ID = SEMESTERS.find((item) => item.status === 'Chưa mở')?.id || SEMESTERS[0]?.id

const studentRow = source.sinhVien[0] || {}
const studentMajorCode = String(studentRow['Mã ngành'] || '')
const studentCohort = String(studentRow['Khóa nhập học'] || '')
const studentProgram = PROGRAMS.find((item) => item.code === studentMajorCode && item.cohort === studentCohort)
const studentDebt = source.taiChinh.filter((row) => String(row['Mã']) === String(studentRow['Mã sinh viên']))
export const DEMO_STUDENT = {
  id: String(studentRow['Mã sinh viên'] || ''),
  name: String(studentRow['Họ và tên'] || ''),
  email: String(studentRow.Email || ''),
  className: String(studentRow['Mã lớp'] || ''),
  programId: studentProgram?.id || '',
  majorCode: studentMajorCode,
  academicStatus: 'Chưa có dữ liệu học vụ trong workbook',
  debtBySemester: Object.fromEntries(studentDebt.map((row) => [String(row['Học kỳ']), String(row['Trạng thái'])])),
  passedCourses: [],
  transcriptAvailable: false,
}

export const ROOM_DATA = source.phongCSVC.map((row) => ({
  code: String(row['Mã phòng'] || ''),
  building: String(row['Tòa nhà'] || ''),
  capacity: Number(row['Sức chứa'] || 0),
  type: String(row['Loại phòng'] || ''),
  equipment: String(row['Thiết bị'] || ''),
  status: String(row['Trạng thái'] || ''),
}))

export const TRAINING_ROOM_DATA = source.phongDaoTao.map((row) => ({
  ma: String(row['Mã'] || ''),
  ten: String(row['Tên'] || ''),
  toa: String(row['Tòa nhà'] || ''),
  sucChua: String(row['Sức chứa'] || ''),
  loai: String(row['Loại phòng'] || ''),
  trangThai: String(row['Trạng thái'] || ''),
}))

export const FINANCE_DATA = source.taiChinh.map((row) => ({
  ma: String(row['Mã'] || ''),
  hoTen: String(row['Họ và tên'] || ''),
  hocKy: String(row['Học kỳ'] || ''),
  phaiThu: String(row['Phải thu'] || ''),
  daNop: String(row['Đã nộp'] || ''),
  trangThai: String(row['Trạng thái'] || ''),
}))
