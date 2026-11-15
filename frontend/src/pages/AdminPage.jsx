import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// ─── Mock Data ────────────────────────────────────────────────────────────────
const mockSinhVien = [
  { id: 1, ma: 'SV001', hoTen: 'Nguyễn Văn An', email: 'an.nv@edu.vn', khoa: '2022', lop: 'CNTT01', nganh: 'Công nghệ thông tin', khoa_: 'Khoa CNTT', trangThai: 'active' },
  { id: 2, ma: 'SV002', hoTen: 'Trần Thị Bình', email: 'binh.tt@edu.vn', khoa: '2022', lop: 'CNTT01', nganh: 'Công nghệ thông tin', khoa_: 'Khoa CNTT', trangThai: 'active' },
  { id: 3, ma: 'SV003', hoTen: 'Lê Minh Cường', email: 'cuong.lm@edu.vn', khoa: '2021', lop: 'KTPM02', nganh: 'Kỹ thuật phần mềm', khoa_: 'Khoa CNTT', trangThai: 'inactive' },
  { id: 4, ma: 'SV004', hoTen: 'Phạm Thị Dung', email: 'dung.pt@edu.vn', khoa: '2023', lop: 'HTTT01', nganh: 'Hệ thống thông tin', khoa_: 'Khoa CNTT', trangThai: 'active' },
  { id: 5, ma: 'SV005', hoTen: 'Hoàng Văn Em', email: 'em.hv@edu.vn', khoa: '2023', lop: 'CNTT02', nganh: 'Công nghệ thông tin', khoa_: 'Khoa CNTT', trangThai: 'active' },
  { id: 6, ma: 'SV006', hoTen: 'Vũ Thị Fương', email: 'fuong.vt@edu.vn', khoa: '2021', lop: 'KTPM01', nganh: 'Kỹ thuật phần mềm', khoa_: 'Khoa CNTT', trangThai: 'inactive' },
  { id: 7, ma: 'SV007', hoTen: 'Đặng Quốc Gia', email: 'gia.dq@edu.vn', khoa: '2022', lop: 'CNTT03', nganh: 'Công nghệ thông tin', khoa_: 'Khoa CNTT', trangThai: 'active' },
]

const mockQuanLyKhoa = [
  { id: 1, ma: 'NV001', hoTen: 'PGS.TS. Nguyễn Mạnh Hùng', email: 'hung.nm@edu.vn', khoaNganh: 'Khoa CNTT', chucVu: 'Trưởng khoa', trangThai: 'active' },
  { id: 2, ma: 'NV002', hoTen: 'TS. Trần Thị Lan', email: 'lan.tt@edu.vn', khoaNganh: 'Khoa CNTT', chucVu: 'Phó trưởng khoa', trangThai: 'active' },
  { id: 3, ma: 'NV003', hoTen: 'ThS. Lê Văn Minh', email: 'minh.lv@edu.vn', khoaNganh: 'Ngành KTPM', chucVu: 'Trưởng ngành', trangThai: 'active' },
  { id: 4, ma: 'NV004', hoTen: 'TS. Phạm Quốc Nam', email: 'nam.pq@edu.vn', khoaNganh: 'Ngành HTTT', chucVu: 'Trưởng ngành', trangThai: 'inactive' },
  { id: 5, ma: 'NV005', hoTen: 'ThS. Hoàng Thị Oanh', email: 'oanh.ht@edu.vn', khoaNganh: 'Khoa Kinh tế', chucVu: 'Trưởng khoa', trangThai: 'active' },
  { id: 6, ma: 'NV006', hoTen: 'GS.TS. Vũ Đình Phúc', email: 'phuc.vd@edu.vn', khoaNganh: 'Khoa Cơ bản', chucVu: 'Trưởng khoa', trangThai: 'active' },
]

const mockPhongDaoTao = [
  { id: 1, ma: 'NV101', hoTen: 'ThS. Bùi Thị Quỳnh', email: 'quynh.bt@edu.vn', boPhan: 'Phòng Đào tạo', chucVu: 'Trưởng phòng', trangThai: 'active' },
  { id: 2, ma: 'NV102', hoTen: 'CN. Đỗ Văn Rồng', email: 'rong.dv@edu.vn', boPhan: 'Phòng Đào tạo', chucVu: 'Chuyên viên', trangThai: 'active' },
  { id: 3, ma: 'NV103', hoTen: 'CN. Ngô Thị Sương', email: 'suong.nt@edu.vn', boPhan: 'Phòng Đào tạo', chucVu: 'Chuyên viên', trangThai: 'active' },
  { id: 4, ma: 'NV104', hoTen: 'CN. Đinh Minh Tuấn', email: 'tuan.dm@edu.vn', boPhan: 'Phòng Đào tạo', chucVu: 'Chuyên viên', trangThai: 'inactive' },
  { id: 5, ma: 'NV105', hoTen: 'ThS. Lương Thị Uyên', email: 'uyen.lt@edu.vn', boPhan: 'Phòng Đào tạo', chucVu: 'Phó trưởng phòng', trangThai: 'active' },
]

// ─── Color palette ─────────────────────────────────────────────────────────────
const C = {
  primary: '#171717',
  primaryLight: '#3b3b3b',
  primaryDark: '#000000',
  accent: '#171717',
  success: '#2E7D32',
  error: '#C62828',
  warning: '#F57F17',
  bg: '#F5F5F3',
  card: '#FFFFFF',
  textPrimary: '#212121',
  textSecondary: '#616161',
  border: '#E0E0E0',
}

// ─── Shared micro-components ───────────────────────────────────────────────────
function Badge({ active }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 600,
      background: active ? '#E8F5E9' : '#FFEBEE',
      color: active ? C.success : C.error,
      border: `1px solid ${active ? '#A5D6A7' : '#EF9A9A'}`,
    }}>
      <span style={{ fontSize: '8px' }}>{active ? '●' : '●'}</span>
      {active ? 'Hoạt động' : 'Ngừng hoạt động'}
    </span>
  )
}

function ActionBtn({ icon, label, color, onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      title={label}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? color : `${color}18`,
        color: hov ? '#fff' : color,
        border: `1px solid ${color}40`,
        borderRadius: '6px',
        padding: '5px 9px',
        fontSize: '14px',
        cursor: 'pointer',
        transition: 'all 0.15s',
        marginRight: '4px',
      }}
    >
      {icon}
    </button>
  )
}

function Modal({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.45)',
      zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '16px',
    }} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{
        background: C.card,
        borderRadius: '12px',
        boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
        width: '100%',
        maxWidth: '560px',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: `1px solid ${C.border}`,
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: C.primary }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: C.textSecondary, lineHeight: 1 }}>✕</button>
        </div>
        <div style={{ padding: '24px' }}>{children}</div>
      </div>
    </div>
  )
}

function ConfirmDialog({ open, onClose, onConfirm, message }) {
  if (!open) return null
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.45)',
      zIndex: 1100,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '16px',
    }}>
      <div style={{
        background: C.card,
        borderRadius: '12px',
        boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
        width: '100%',
        maxWidth: '400px',
        padding: '28px 24px',
      }}>
        <div style={{ fontSize: '40px', textAlign: 'center', marginBottom: '16px' }}>🗑️</div>
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: C.textPrimary, textAlign: 'center', marginBottom: '12px' }}>Xác nhận xóa</h3>
        <p style={{ color: C.textSecondary, textAlign: 'center', marginBottom: '24px', fontSize: '14px' }}>{message}</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button onClick={onClose} style={{ padding: '10px 24px', borderRadius: '8px', border: `1px solid ${C.border}`, background: '#FFF', color: C.textPrimary, fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>Hủy</button>
          <button onClick={onConfirm} style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', background: C.error, color: '#FFF', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}>Xóa</button>
        </div>
      </div>
    </div>
  )
}

function FormField({ label, id, required, children }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label htmlFor={id} style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#424242', marginBottom: '6px' }}>
        {label} {required && <span style={{ color: C.error }}>*</span>}
      </label>
      {children}
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  border: `1.5px solid ${C.border}`,
  borderRadius: '8px',
  fontSize: '14px',
  color: C.textPrimary,
  background: '#FFF',
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function AdminPage() {
  const navigate = useNavigate()
  const [selectedRole, setSelectedRole] = useState('sinh-vien')
  const [search, setSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [toast, setToast] = useState(null)

  // Data state
  const [svData, setSvData] = useState(mockSinhVien)
  const [qlData, setQlData] = useState(mockQuanLyKhoa)
  const [pdtData, setPdtData] = useState(mockPhongDaoTao)

  // Add form state
  const [addForm, setAddForm] = useState({})

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const currentData = selectedRole === 'sinh-vien' ? svData : selectedRole === 'quan-ly-khoa' ? qlData : pdtData

  const filteredData = currentData.filter(u =>
    u.hoTen.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.ma.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = () => {
    if (!selectedUser) return
    if (selectedRole === 'sinh-vien') setSvData(d => d.filter(u => u.id !== selectedUser.id))
    else if (selectedRole === 'quan-ly-khoa') setQlData(d => d.filter(u => u.id !== selectedUser.id))
    else setPdtData(d => d.filter(u => u.id !== selectedUser.id))
    setShowDeleteDialog(false)
    setSelectedUser(null)
    showToast('Đã xóa tài khoản thành công!', 'success')
  }

  const handleAdd = () => {
    const newId = Math.max(...currentData.map(u => u.id), 0) + 1
    const newUser = { id: newId, trangThai: 'active', ...addForm }
    if (selectedRole === 'sinh-vien') setSvData(d => [...d, { ma: `SV${String(newId).padStart(3,'0')}`, khoa: '2024', lop: '', nganh: '', khoa_: 'Khoa CNTT', ...newUser }])
    else if (selectedRole === 'quan-ly-khoa') setQlData(d => [...d, { ma: `NV${String(newId).padStart(3,'0')}`, khoaNganh: '', chucVu: '', ...newUser }])
    else setPdtData(d => [...d, { ma: `NV${String(newId+100).padStart(3,'0')}`, boPhan: 'Phòng Đào tạo', chucVu: '', ...newUser }])
    setShowAddModal(false)
    setAddForm({})
    showToast('Thêm tài khoản thành công!', 'success')
  }

  const sideItems = [
    { icon: '👥', label: 'Quản lý tài khoản', active: true },
    { icon: '▦', label: 'Quản lý đào tạo', path: '/admin/dao-tao?module=hoc-phan', active: true },
    { icon: '▣', label: 'Quản lý phòng học', path: '/admin/dao-tao?module=phong-hoc', active: true },
    { icon: '◫', label: 'Lớp học phần', path: '/admin/dao-tao?module=lop-hoc-phan', active: true },
    { icon: '◷', label: 'Đợt đăng ký', path: '/admin/dao-tao?module=dot-dang-ky', active: true },
    { icon: '₫', label: 'Tài chính sinh viên', path: '/admin/dao-tao?module=tai-chinh', active: true },
    { icon: '☷', label: 'Nhật ký hoạt động', path: '/admin/dao-tao?module=nhat-ky', active: true },
    { icon: '⚙️', label: 'Cài đặt hệ thống', active: false },
    { icon: '📊', label: 'Báo cáo thống kê', active: false },
    { icon: '🔔', label: 'Thông báo hệ thống', active: false },
    { icon: '📋', label: 'Nhật ký hoạt động', active: false },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: C.bg, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: '20px', right: '20px', zIndex: 9999,
          background: toast.type === 'success' ? '#E8F5E9' : '#FFEBEE',
          border: `1px solid ${toast.type === 'success' ? '#A5D6A7' : '#EF9A9A'}`,
          color: toast.type === 'success' ? C.success : C.error,
          padding: '12px 20px', borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          fontWeight: 600, fontSize: '14px',
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          {toast.type === 'success' ? '✅' : '❌'} {toast.msg}
        </div>
      )}

      {/* Navbar */}
      <header style={{
        background: C.primary,
        color: '#FFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        height: '60px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        flexShrink: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>🎓</span>
          <span style={{ fontWeight: 700, fontSize: '16px', letterSpacing: '0.3px' }}>HỆ THỐNG ĐĂNG KÝ TÍN CHỈ</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '16px', fontWeight: 700,
            }}>A</div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600 }}>Admin</div>
              <div style={{ fontSize: '11px', opacity: 0.75 }}>Quản trị viên</div>
            </div>
          </div>
          <button
            onClick={() => navigate('/login')}
            style={{
              background: 'rgba(255,255,255,0.15)',
              color: '#FFF',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '8px',
              padding: '8px 16px',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.25)' }}
            onMouseLeave={e => { e.target.style.background = 'rgba(255,255,255,0.15)' }}
          >
            🚪 Đăng xuất
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <aside style={{
          width: '240px',
          background: C.card,
          borderRight: `1px solid ${C.border}`,
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          overflowY: 'auto',
        }}>
          <div style={{ padding: '20px 16px 8px', fontSize: '11px', fontWeight: 700, color: C.textSecondary, letterSpacing: '0.8px', textTransform: 'uppercase' }}>
            Chức năng
          </div>
          {sideItems.map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '11px 16px',
              borderRadius: '8px',
              margin: '2px 8px',
              cursor: item.active ? 'pointer' : 'default',
              background: item.active ? '#E3F2FD' : 'transparent',
              color: item.active ? C.primary : item.active === false ? '#BDBDBD' : C.textSecondary,
              fontWeight: item.active ? 700 : 500,
              fontSize: '14px',
              transition: 'background 0.15s',
              opacity: !item.active && i > 0 ? 0.5 : 1,
            }} onClick={() => item.path && navigate(item.path)}>
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              {item.label}
            </div>
          ))}

          <div style={{ flex: 1 }} />
          <div style={{ padding: '16px', borderTop: `1px solid ${C.border}`, fontSize: '12px', color: C.textSecondary }}>
            <div style={{ fontWeight: 600, marginBottom: '4px' }}>Phiên bản 2.1.0</div>
            <div>© 2025 Trường ĐH XYZ</div>
          </div>
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {/* Page header */}
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: C.textPrimary, marginBottom: '4px' }}>
              👥 Quản lý tài khoản người dùng
            </h1>
            <p style={{ color: C.textSecondary, fontSize: '14px' }}>
              Quản lý và phân quyền tài khoản trong hệ thống đăng ký tín chỉ
            </p>
          </div>

          {/* Controls card */}
          <div style={{ background: C.card, borderRadius: '12px', border: `1px solid ${C.border}`, padding: '20px', marginBottom: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
              {/* Role selector */}
              <div style={{ display: 'flex', background: C.bg, borderRadius: '8px', border: `1px solid ${C.border}`, overflow: 'hidden' }}>
                {[
                  { value: 'sinh-vien', label: '🎓 Sinh viên' },
                  { value: 'quan-ly-khoa', label: '🏫 Quản lý Khoa/Ngành' },
                  { value: 'phong-dao-tao', label: '📋 Phòng Đào tạo' },
                ].map(opt => (
                  <button key={opt.value}
                    onClick={() => { setSelectedRole(opt.value); setSearch('') }}
                    style={{
                      padding: '8px 16px', border: 'none', cursor: 'pointer',
                      fontWeight: selectedRole === opt.value ? 700 : 500,
                      fontSize: '13px',
                      background: selectedRole === opt.value ? C.primary : 'transparent',
                      color: selectedRole === opt.value ? '#FFF' : C.textSecondary,
                      transition: 'all 0.15s',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px' }}>🔍</span>
                <input
                  type="text"
                  placeholder="Tìm theo tên, mã, email..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ ...inputStyle, paddingLeft: '34px', fontSize: '13px' }}
                />
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
                <button
                  onClick={() => { setAddForm({}); setShowAddModal(true) }}
                  style={{
                    padding: '9px 18px', background: C.accent, color: '#FFF',
                    border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '6px',
                    boxShadow: '0 2px 8px rgba(230,81,0,0.3)',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#BF360C' }}
                  onMouseLeave={e => { e.currentTarget.style.background = C.accent }}
                >
                  ➕ Thêm tài khoản
                </button>
                <button
                  style={{
                    padding: '9px 18px', background: '#FFF', color: C.primary,
                    border: `1.5px solid ${C.primary}`, borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '6px',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#E3F2FD' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#FFF' }}
                >
                  📥 Nhập từ Excel
                </button>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
            {[
              { label: 'Tổng tài khoản', value: currentData.length, icon: '👥', color: C.primary },
              { label: 'Đang hoạt động', value: currentData.filter(u => u.trangThai === 'active').length, icon: '✅', color: C.success },
              { label: 'Ngừng hoạt động', value: currentData.filter(u => u.trangThai !== 'active').length, icon: '🚫', color: C.error },
              { label: 'Kết quả tìm kiếm', value: filteredData.length, icon: '🔍', color: '#F57F17' },
            ].map((stat, i) => (
              <div key={i} style={{
                background: C.card, borderRadius: '10px', border: `1px solid ${C.border}`,
                padding: '16px 20px', flex: '1', minWidth: '140px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '13px', color: C.textSecondary, marginBottom: '4px' }}>{stat.label}</div>
                    <div style={{ fontSize: '26px', fontWeight: 800, color: stat.color }}>{stat.value}</div>
                  </div>
                  <span style={{ fontSize: '32px' }}>{stat.icon}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Table */}
          <div style={{ background: C.card, borderRadius: '12px', border: `1px solid ${C.border}`, boxShadow: '0 1px 4px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: '15px', color: C.textPrimary }}>
                Danh sách tài khoản ({filteredData.length})
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#F8F9FB', borderBottom: `2px solid ${C.border}` }}>
                    {selectedRole === 'sinh-vien' && (
                      <>
                        <Th>STT</Th><Th>Mã SV</Th><Th>Họ và Tên</Th><Th>Email</Th>
                        <Th>Khóa</Th><Th>Lớp</Th><Th>Ngành</Th><Th>Khoa</Th>
                        <Th>Trạng thái</Th><Th>Thao tác</Th>
                      </>
                    )}
                    {selectedRole === 'quan-ly-khoa' && (
                      <>
                        <Th>STT</Th><Th>Mã NV</Th><Th>Họ và Tên</Th><Th>Email</Th>
                        <Th>Khoa/Ngành</Th><Th>Chức vụ</Th>
                        <Th>Trạng thái</Th><Th>Thao tác</Th>
                      </>
                    )}
                    {selectedRole === 'phong-dao-tao' && (
                      <>
                        <Th>STT</Th><Th>Mã NV</Th><Th>Họ và Tên</Th><Th>Email</Th>
                        <Th>Bộ phận</Th><Th>Chức vụ</Th>
                        <Th>Trạng thái</Th><Th>Thao tác</Th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={10} style={{ textAlign: 'center', padding: '40px', color: C.textSecondary }}>
                        <div style={{ fontSize: '40px', marginBottom: '8px' }}>🔍</div>
                        <div>Không tìm thấy tài khoản phù hợp</div>
                      </td>
                    </tr>
                  ) : filteredData.map((user, idx) => (
                    <TableRow key={user.id} even={idx % 2 === 0}>
                      <Td>{idx + 1}</Td>
                      <Td><span style={{ fontWeight: 600, color: C.primary }}>{user.ma}</span></Td>
                      <Td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{
                            width: '32px', height: '32px', borderRadius: '50%',
                            background: `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#FFF', fontSize: '12px', fontWeight: 700, flexShrink: 0,
                          }}>
                            {user.hoTen.split(' ').pop()[0]}
                          </div>
                          <span style={{ fontWeight: 600, color: C.textPrimary }}>{user.hoTen}</span>
                        </div>
                      </Td>
                      <Td style={{ color: C.textSecondary }}>{user.email}</Td>
                      {selectedRole === 'sinh-vien' && (
                        <>
                          <Td>{user.khoa}</Td>
                          <Td>{user.lop}</Td>
                          <Td>{user.nganh}</Td>
                          <Td>{user.khoa_}</Td>
                        </>
                      )}
                      {selectedRole === 'quan-ly-khoa' && (
                        <>
                          <Td>{user.khoaNganh}</Td>
                          <Td>{user.chucVu}</Td>
                        </>
                      )}
                      {selectedRole === 'phong-dao-tao' && (
                        <>
                          <Td>{user.boPhan}</Td>
                          <Td>{user.chucVu}</Td>
                        </>
                      )}
                      <Td><Badge active={user.trangThai === 'active'} /></Td>
                      <Td>
                        <ActionBtn icon="👁️" label="Xem chi tiết" color={C.primary} onClick={() => { setSelectedUser(user); setShowViewModal(true) }} />
                        <ActionBtn icon="✏️" label="Chỉnh sửa" color={C.warning} onClick={() => showToast('Chức năng chỉnh sửa đang phát triển', 'info')} />
                        <ActionBtn icon="🗑️" label="Xóa" color={C.error} onClick={() => { setSelectedUser(user); setShowDeleteDialog(true) }} />
                      </Td>
                    </TableRow>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Add Account Modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title={`➕ Thêm tài khoản — ${selectedRole === 'sinh-vien' ? 'Sinh viên' : selectedRole === 'quan-ly-khoa' ? 'Quản lý Khoa/Ngành' : 'Phòng Đào tạo'}`}>
        <div>
          <FormField label="Họ và tên" id="ht" required>
            <input id="ht" style={inputStyle} placeholder="Nhập họ và tên..." value={addForm.hoTen || ''} onChange={e => setAddForm(f => ({ ...f, hoTen: e.target.value }))} />
          </FormField>
          <FormField label="Email" id="em" required>
            <input id="em" type="email" style={inputStyle} placeholder="Nhập email..." value={addForm.email || ''} onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))} />
          </FormField>
          <FormField label="Mật khẩu" id="pw" required>
            <input id="pw" type="password" style={inputStyle} placeholder="Nhập mật khẩu..." value={addForm.password || ''} onChange={e => setAddForm(f => ({ ...f, password: e.target.value }))} />
          </FormField>

          {selectedRole === 'sinh-vien' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <FormField label="Lớp" id="lop">
                  <input id="lop" style={inputStyle} placeholder="VD: CNTT01" value={addForm.lop || ''} onChange={e => setAddForm(f => ({ ...f, lop: e.target.value }))} />
                </FormField>
                <FormField label="Khóa" id="kh">
                  <input id="kh" style={inputStyle} placeholder="VD: 2024" value={addForm.khoa || ''} onChange={e => setAddForm(f => ({ ...f, khoa: e.target.value }))} />
                </FormField>
              </div>
              <FormField label="Ngành" id="ng">
                <input id="ng" style={inputStyle} placeholder="Nhập ngành học..." value={addForm.nganh || ''} onChange={e => setAddForm(f => ({ ...f, nganh: e.target.value }))} />
              </FormField>
            </>
          )}

          {selectedRole === 'quan-ly-khoa' && (
            <>
              <FormField label="Khoa/Ngành phụ trách" id="kn">
                <input id="kn" style={inputStyle} placeholder="VD: Khoa CNTT" value={addForm.khoaNganh || ''} onChange={e => setAddForm(f => ({ ...f, khoaNganh: e.target.value }))} />
              </FormField>
              <FormField label="Chức vụ" id="cv">
                <select id="cv" style={inputStyle} value={addForm.chucVu || ''} onChange={e => setAddForm(f => ({ ...f, chucVu: e.target.value }))}>
                  <option value="">-- Chọn chức vụ --</option>
                  <option>Trưởng khoa</option>
                  <option>Phó trưởng khoa</option>
                  <option>Trưởng ngành</option>
                </select>
              </FormField>
            </>
          )}

          {selectedRole === 'phong-dao-tao' && (
            <FormField label="Chức vụ" id="cv2">
              <select id="cv2" style={inputStyle} value={addForm.chucVu || ''} onChange={e => setAddForm(f => ({ ...f, chucVu: e.target.value }))}>
                <option value="">-- Chọn chức vụ --</option>
                <option>Trưởng phòng</option>
                <option>Phó trưởng phòng</option>
                <option>Chuyên viên</option>
              </select>
            </FormField>
          )}

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button onClick={() => setShowAddModal(false)} style={{ padding: '10px 24px', borderRadius: '8px', border: `1px solid ${C.border}`, background: '#FFF', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>Hủy</button>
            <button onClick={handleAdd} style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', background: C.primary, color: '#FFF', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}>✅ Lưu tài khoản</button>
          </div>
        </div>
      </Modal>

      {/* View Detail Modal */}
      <Modal open={showViewModal} onClose={() => setShowViewModal(false)} title="👁️ Chi tiết tài khoản">
        {selectedUser && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', padding: '16px', background: C.bg, borderRadius: '10px' }}>
              <div style={{
                width: '60px', height: '60px', borderRadius: '50%',
                background: `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#FFF', fontSize: '24px', fontWeight: 700, flexShrink: 0,
              }}>
                {selectedUser.hoTen?.split(' ').pop()[0]}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '18px', color: C.textPrimary }}>{selectedUser.hoTen}</div>
                <div style={{ color: C.textSecondary, fontSize: '13px' }}>{selectedUser.email}</div>
                <Badge active={selectedUser.trangThai === 'active'} />
              </div>
            </div>
            {Object.entries(selectedUser)
              .filter(([k]) => !['id', 'trangThai'].includes(k))
              .map(([k, v]) => (
                <div key={k} style={{ display: 'flex', padding: '10px 0', borderBottom: `1px solid ${C.border}`, fontSize: '14px' }}>
                  <span style={{ width: '160px', flexShrink: 0, color: C.textSecondary, fontWeight: 500 }}>{fieldLabel(k)}</span>
                  <span style={{ fontWeight: 600, color: C.textPrimary }}>{v}</span>
                </div>
              ))}
          </div>
        )}
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        message={`Bạn có chắc chắn muốn xóa tài khoản "${selectedUser?.hoTen}"? Hành động này không thể hoàn tác.`}
      />
    </div>
  )
}

function fieldLabel(key) {
  const map = {
    ma: 'Mã số', hoTen: 'Họ và tên', email: 'Email',
    khoa: 'Khóa', lop: 'Lớp', nganh: 'Ngành', khoa_: 'Khoa',
    khoaNganh: 'Khoa/Ngành', chucVu: 'Chức vụ', boPhan: 'Bộ phận',
  }
  return map[key] || key
}

function Th({ children }) {
  return (
    <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, fontSize: '12px', color: '#616161', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
      {children}
    </th>
  )
}

function Td({ children, style }) {
  return (
    <td style={{ padding: '12px 14px', color: '#424242', fontSize: '13px', whiteSpace: 'nowrap', ...style }}>
      {children}
    </td>
  )
}

function TableRow({ children, even }) {
  const [hov, setHov] = useState(false)
  return (
    <tr
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? '#F0F7FF' : even ? '#FFFFFF' : '#FAFAFA',
        borderBottom: '1px solid #F0F0F0',
        transition: 'background 0.12s',
      }}
    >
      {children}
    </tr>
  )
}
