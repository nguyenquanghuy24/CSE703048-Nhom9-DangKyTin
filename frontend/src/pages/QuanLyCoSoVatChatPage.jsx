import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './QuanLyCoSoVatChatPage.css'

const initialRooms = [
  { code: 'A4-202', building: 'A4', capacity: 60, type: 'Lý thuyết', equipment: 'Máy chiếu, bảng', status: 'Sẵn sàng' },
  { code: 'A3-503', building: 'A3', capacity: 45, type: 'Thực hành', equipment: '45 máy tính', status: 'Sẵn sàng' },
  { code: 'B2-101', building: 'B2', capacity: 80, type: 'Lý thuyết', equipment: 'Máy chiếu, âm thanh', status: 'Đang sử dụng' },
  { code: 'C1-305', building: 'C1', capacity: 35, type: 'Thực hành', equipment: 'Máy tính, bảng', status: 'Bảo trì' },
]

export default function QuanLyCoSoVatChatPage() {
  const navigate = useNavigate()
  const [rooms, setRooms] = useState(initialRooms)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('Tất cả')
  const [editing, setEditing] = useState(null)
  const filtered = useMemo(() => rooms.filter((room) => `${room.code} ${room.building} ${room.type} ${room.equipment}`.toLowerCase().includes(query.toLowerCase()) && (filter === 'Tất cả' || room.status === filter)), [rooms, query, filter])
  const available = rooms.filter((room) => room.status === 'Sẵn sàng').length
  const saveRoom = (event) => {
    event.preventDefault()
    const room = Object.fromEntries(new FormData(event.currentTarget))
    setRooms((current) => editing?.index === undefined ? [...current, room] : current.map((item, index) => index === editing.index ? room : item))
    setEditing(null)
  }
  const logout = () => { localStorage.removeItem('portal-session'); navigate('/login', { replace: true }) }
  return <div className="facility-page">
    <aside className="facility-sidebar"><a className="facility-brand" href="/quan-ly-csvc"><span>PK</span><div><b>PHENIKAA</b><small>Campus workspace</small></div></a><div className="facility-nav-label">CƠ SỞ VẬT CHẤT</div><a className="facility-nav active" href="/quan-ly-csvc">Tổng quan phòng học</a><div className="facility-sidebar-bottom"><div className="facility-user"><span className="facility-avatar">CS</span><div><b>Quản lý CSVC</b><small>csvc@edu.vn</small></div></div><button onClick={logout}>Đăng xuất <span>↗</span></button></div></aside>
    <main className="facility-main"><header className="facility-topbar"><span>Không gian làm việc <b>/ Cơ sở vật chất</b></span><span className="facility-live"><i /> Dữ liệu nội bộ</span></header>
      <section className="facility-heading"><div><span className="facility-kicker">QUẢN LÝ VẬN HÀNH</span><h1>Phòng học</h1><p>Theo dõi phòng, sức chứa và tình trạng thiết bị trong khuôn viên.</p></div><button className="facility-primary" onClick={() => setEditing({})}>＋ Thêm phòng học</button></section>
      <section className="facility-stats"><article><span>Tổng số phòng</span><b>{rooms.length}</b><small>Trong danh mục quản lý</small></article><article><span>Sẵn sàng</span><b>{available}</b><small>Có thể xếp lịch</small></article><article><span>Đang sử dụng</span><b>{rooms.filter((room) => room.status === 'Đang sử dụng').length}</b><small>Được xếp lớp hiện tại</small></article><article><span>Bảo trì</span><b>{rooms.filter((room) => room.status === 'Bảo trì').length}</b><small>Tạm ngưng khai thác</small></article></section>
      <section className="facility-card"><div className="facility-card-heading"><div><h2>Danh sách phòng</h2><p>{filtered.length} phòng phù hợp</p></div><button className="facility-export" onClick={() => window.print()}>Xuất / In danh sách</button></div><div className="facility-filters"><label className="facility-search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo mã phòng, tòa nhà, loại phòng…" /></label><select value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Lọc trạng thái"><option>Tất cả</option><option>Sẵn sàng</option><option>Đang sử dụng</option><option>Bảo trì</option></select></div>
        <div className="facility-table-wrap"><table className="facility-table"><thead><tr><th>Mã phòng</th><th>Tòa nhà</th><th>Sức chứa</th><th>Loại phòng</th><th>Thiết bị</th><th>Trạng thái</th><th /></tr></thead><tbody>{filtered.map((room) => { const index = rooms.indexOf(room); return <tr key={`${room.code}-${index}`}><td><b>{room.code}</b></td><td>{room.building}</td><td>{room.capacity} chỗ</td><td>{room.type}</td><td>{room.equipment}</td><td><span className={`facility-status ${room.status === 'Sẵn sàng' ? 'ready' : room.status === 'Bảo trì' ? 'maintenance' : 'occupied'}`}><i />{room.status}</span></td><td><button className="facility-edit" onClick={() => setEditing({ ...room, index })}>Chỉnh sửa</button></td></tr> })}</tbody></table>{!filtered.length && <div className="facility-empty">Không tìm thấy phòng phù hợp.</div>}</div>
        <footer className="facility-table-foot">Hiển thị {filtered.length} / {rooms.length} phòng học</footer></section>
    </main>
    {editing && <div className="facility-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setEditing(null)}><form className="facility-modal" onSubmit={saveRoom}><div className="facility-modal-head"><div><span>THÔNG TIN CƠ SỞ</span><h2>{editing.index === undefined ? 'Thêm phòng học' : 'Cập nhật phòng học'}</h2></div><button type="button" onClick={() => setEditing(null)}>×</button></div><div className="facility-form-grid"><label>Mã phòng<input name="code" defaultValue={editing.code} required /></label><label>Tòa nhà<input name="building" defaultValue={editing.building} required /></label><label>Sức chứa<input name="capacity" type="number" min="1" defaultValue={editing.capacity} required /></label><label>Loại phòng<select name="type" defaultValue={editing.type || 'Lý thuyết'}><option>Lý thuyết</option><option>Thực hành</option><option>Hội trường</option></select></label><label className="wide">Thiết bị<input name="equipment" defaultValue={editing.equipment} placeholder="Máy chiếu, máy tính…" /></label><label className="wide">Trạng thái<select name="status" defaultValue={editing.status || 'Sẵn sàng'}><option>Sẵn sàng</option><option>Đang sử dụng</option><option>Bảo trì</option></select></label></div><div className="facility-modal-actions"><button type="button" onClick={() => setEditing(null)}>Hủy</button><button type="submit">Lưu phòng học</button></div></form></div>}
  </div>
}
