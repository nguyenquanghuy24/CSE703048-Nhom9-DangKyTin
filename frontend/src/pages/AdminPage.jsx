
import React, { useState, useEffect } from 'react';

/* ===== Dữ liệu dùng chung (cùng mã học phần / mã lớp / học phí với trang Sinh viên) ===== */
const HOC_PHI = '1,577,250 đ';
const KY_HIEN_TAI = 'HK3 2024-2025';
const GIANG_VIEN = ['Trịnh Thanh Bình', 'Vũ Quang Dũng'];
const THU = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
const CA = ['Ca 1', 'Ca 2', 'Ca 3', 'Ca 4'];
const TRANG_THAI = ['Chưa mở', 'Mở', 'Đóng', 'Hủy'];
const MAU_TT = { 'Chưa mở': '#7f8c8d', 'Mở': '#3b8b40', 'Đóng': '#f39c12', 'Hủy': '#e74c3c' };

const HOC_PHAN = [
  { maHocPhan: 'CSE703006', tenHocPhan: 'Cấu trúc dữ liệu và thuật toán(Học đi)', tinChi: 3 },
  { maHocPhan: 'CSE702025', tenHocPhan: 'Kỹ thuật phần mềm(Học đi)', tinChi: 3 },
  { maHocPhan: 'CSE702017', tenHocPhan: 'Hệ điều hành(Học đi)', tinChi: 3 },
  { maHocPhan: 'CSE703023', tenHocPhan: 'Kiến trúc máy tính(Học đi)', tinChi: 3 },
];

const mkLop = (maLop, hp, gv, phong, thu, ca, siSo, daDk, tt) => ({
  maLop, maHocPhan: hp.maHocPhan, tenHocPhan: hp.tenHocPhan, tinChi: hp.tinChi,
  giangVien: gv, phong, thu, ca, siSoToiDa: siSo, daDangKy: daDk, trangThai: tt, hocPhi: HOC_PHI, hocKy: KY_HIEN_TAI,
});
const LOP_BAN_DAU = [
  mkLop('Cấu trúc dữ liệu và thuật toán-1-3-24(COUR01)', HOC_PHAN[0], GIANG_VIEN[0], 'A2-301', 'Thứ 2', 'Ca 1', 100, 90, 'Mở'),
  mkLop('Cấu trúc dữ liệu và thuật toán-2-3-24(COUR02)', HOC_PHAN[0], GIANG_VIEN[1], 'A2-302', 'Thứ 4', 'Ca 2', 100, 100, 'Mở'),
  mkLop('Kỹ thuật phần mềm-1-3-24(COUR01)', HOC_PHAN[1], GIANG_VIEN[0], 'A3-105', 'Thứ 3', 'Ca 1', 500, 0, 'Mở'),
  mkLop('Hệ điều hành-1-3-24(COUR01)', HOC_PHAN[2], GIANG_VIEN[1], 'B1-204', 'Thứ 5', 'Ca 3', 60, 15, 'Mở'),
];

const now = Date.now();
const toLocal = (t) => { const d = new Date(t - new Date(t).getTimezoneOffset() * 60000); return d.toISOString().slice(0, 16); };
const fmt = (s) => new Date(s).toLocaleString('vi-VN', { hour12: false });
const DOT_BAN_DAU = [
  { ma: 'DKH_2024_2025_3.1', ten: 'Đăng ký học HK3 (Đợt học 1_K17)', hocKy: KY_HIEN_TAI, batDau: toLocal(now - 864e5), ketThuc: toLocal(now + 6 * 864e5), trangThai: 'Đang mở' },
  { ma: 'DKH_2024_2025_2.1', ten: 'Đăng ký học HK2 (Đợt học 1_K17)', hocKy: 'HK2 2024-2025', batDau: '2025-01-05T08:00', ketThuc: '2025-01-15T17:00', trangThai: 'Đã đóng' },
];

/* ===== Style dùng chung (giữ nguyên bảng màu của trang Sinh viên) ===== */
const card = { backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' };
const btn = (bg, extra = {}) => ({ padding: '6px 15px', backgroundColor: bg, color: bg === '#ecf0f1' ? '#333' : 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', ...extra });
const input = { width: '100%', padding: '8px 10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '13px', boxSizing: 'border-box' };
const row = { display: 'flex', justifyContent: 'space-between' };

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, padding: '20px' }}>
      <div style={{ ...card, width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ ...row, borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>
          <h4 style={{ margin: 0, color: '#2c3e50' }}>{title}</h4>
          <span onClick={onClose} style={{ cursor: 'pointer', color: '#7f8c8d' }}>✕</span>
        </div>
        {children}
      </div>
    </div>
  );
}
const Field = ({ label, children }) => (
  <label style={{ display: 'block', fontSize: '13px', marginBottom: '12px', color: '#34495e' }}>
    <span style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{label}</span>{children}
  </label>
);

export default function AdminPage() {
  const [lop, setLop] = useState(LOP_BAN_DAU);
  const [dot, setDot] = useState(DOT_BAN_DAU);
  const [logs, setLogs] = useState([{ time: new Date().toISOString(), viec: 'Đăng nhập hệ thống (Phòng Đào tạo)' }]);
  const [tab, setTab] = useState('lop');
  const [hpChon, setHpChon] = useState(null);
  const [tuKhoa, setTuKhoa] = useState('');
  const [locGv, setLocGv] = useState([]);
  const [locThu, setLocThu] = useState([]);
  const [modal, setModal] = useState(null); // {loai, data}
  const [form, setForm] = useState({});
  const [loi, setLoi] = useState('');
  const [thongBao, setThongBao] = useState('');

  const ghiLog = (viec) => setLogs((l) => [{ time: new Date().toISOString(), viec }, ...l]);
  const bao = (m) => { setThongBao(m); setTimeout(() => setThongBao(''), 2500); };
  const dongModal = () => { setModal(null); setLoi(''); };
  const toggle = (arr, set, v) => set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  // R1.2.2 Tự động chuyển đợt đăng ký sang "Đã đóng" khi hết thời gian
  useEffect(() => {
    const tick = () => setDot((ds) => ds.map((d) => (d.trangThai === 'Đang mở' && new Date(d.ketThuc) <= new Date() ? { ...d, trangThai: 'Đã đóng' } : d)));
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  const dotDangMo = dot.find((d) => d.trangThai === 'Đang mở');
  const dem = (t) => lop.filter((l) => l.trangThai === t).length;

  const lopHienThi = lop.filter((l) =>
    (!hpChon || l.maHocPhan === hpChon) &&
    (locGv.length === 0 || locGv.includes(l.giangVien)) &&
    (locThu.length === 0 || locThu.includes(l.thu))
  );
  const hpHienThi = HOC_PHAN.filter((h) => (h.maHocPhan + h.tenHocPhan).toLowerCase().includes(tuKhoa.toLowerCase()));

  /* ---- UC 1.1 Tạo mới / R1.1.3 Chỉnh sửa ---- */
  const moForm = (loai, l) => {
    setForm(l ? { ...l } : { maLop: '', maHocPhan: '', tenHocPhan: '', tinChi: '', giangVien: '', phong: '', thu: '', ca: '', siSoToiDa: '' });
    setLoi(''); setModal({ loai });
  };
  const luu = () => {
    const f = form;
    const thieu = ['maLop', 'tenHocPhan', 'tinChi', 'giangVien', 'phong', 'thu', 'ca', 'siSoToiDa'].some((k) => String(f[k] ?? '').trim() === '');
    const si = Number(f.siSoToiDa), tc = Number(f.tinChi);
    if (thieu || !Number.isInteger(si) || si <= 0 || !Number.isInteger(tc) || tc <= 0)
      return setLoi('Vui lòng điền đầy đủ, đúng định dạng các trường (số tín chỉ và sĩ số phải là số nguyên dương).'); // 1.0.E2
    if (modal.loai === 'them') {
      if (lop.some((l) => l.maLop === f.maLop.trim() && l.hocKy === KY_HIEN_TAI)) return setLoi('Mã lớp học phần đã tồn tại'); // 1.0.E1
      const hp = HOC_PHAN.find((h) => h.tenHocPhan === f.tenHocPhan);
      setLop([...lop, { ...f, maLop: f.maLop.trim(), maHocPhan: hp ? hp.maHocPhan : f.maHocPhan || '—', tinChi: tc, siSoToiDa: si, daDangKy: 0, trangThai: 'Chưa mở', hocPhi: HOC_PHI, hocKy: KY_HIEN_TAI }]);
      ghiLog(`Thêm lớp học phần ${f.maLop}`); bao('Thêm lớp học phần thành công');
    } else {
      if (si < f.daDangKy) return setLoi(`Sĩ số tối đa không được nhỏ hơn số sinh viên đã đăng ký (${f.daDangKy}).`);
      setLop(lop.map((l) => (l.maLop === f.maLop ? { ...l, giangVien: f.giangVien, phong: f.phong, thu: f.thu, ca: f.ca, siSoToiDa: si } : l)));
      ghiLog(`Sửa lớp học phần ${f.maLop}`); bao('Cập nhật lớp học phần thành công');
    }
    dongModal();
  };

  /* ---- R1.1.4 Xóa / R1.3.1 Trạng thái ---- */
  const xoa = () => {
    setLop(lop.filter((l) => l.maLop !== modal.data.maLop));
    ghiLog(`Xóa lớp học phần ${modal.data.maLop}`); bao('Đã xóa lớp học phần'); dongModal();
  };
  const doiTrangThai = (l, tt) => {
    if (tt === 'Mở' && !dotDangMo) return bao('Chưa có đợt đăng ký đang mở để mở lớp này');
    setLop(lop.map((x) => (x.maLop === l.maLop ? { ...x, trangThai: tt } : x)));
    ghiLog(`Đổi trạng thái lớp ${l.maLop}: ${l.trangThai} → ${tt}`);
  };

  /* ---- R1.2 Đợt đăng ký ---- */
  const taoDot = () => {
    if (!form.ten || !form.hocKy || !form.batDau || !form.ketThuc) return setLoi('Vui lòng điền đầy đủ thông tin đợt đăng ký.');
    if (new Date(form.ketThuc) <= new Date(form.batDau)) return setLoi('Thời gian kết thúc phải sau thời gian bắt đầu.');
    const ma = `DKH_${form.hocKy.replace(/\s+/g, '_')}_${dot.length + 1}`;
    setDot([{ ma, ten: form.ten, hocKy: form.hocKy, batDau: form.batDau, ketThuc: form.ketThuc, trangThai: 'Đang mở' }, ...dot.map((d) => (d.trangThai === 'Đang mở' ? { ...d, trangThai: 'Đã đóng' } : d))]);
    ghiLog(`Tạo đợt đăng ký ${ma}`); bao('Tạo đợt đăng ký thành công'); dongModal();
  };
  const dongDot = (d) => { setDot(dot.map((x) => (x.ma === d.ma ? { ...x, trangThai: 'Đã đóng' } : x))); ghiLog(`Đóng đợt đăng ký ${d.ma}`); };

  const Badge = ({ tt }) => <span style={{ backgroundColor: MAU_TT[tt] || '#7f8c8d', color: 'white', padding: '3px 10px', borderRadius: '4px', fontSize: '12px' }}>{tt}</span>;

  return (
    <div style={{ display: 'flex', gap: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#eef2f6', padding: '20px', minHeight: '100vh', flexWrap: 'wrap' }}>
      {thongBao && <div style={{ position: 'fixed', top: 20, right: 20, background: '#3b8b40', color: 'white', padding: '10px 20px', borderRadius: '4px', zIndex: 20, fontSize: '14px' }}>{thongBao}</div>}

      {/* Cột trái */}
      <div style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '20px', flexShrink: 0 }}>
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '15px' }}>
            <div style={{ width: '60px', height: '60px', backgroundColor: '#ccc', borderRadius: '50%' }}></div>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#2c3e50' }}>Phòng Đào tạo</h3>
              <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#7f8c8d' }}>Quản trị viên</p>
            </div>
          </div>
          <div style={{ fontSize: '14px', color: '#34495e', lineHeight: '2' }}>
            <div style={row}><span>Tổng lớp học phần:</span> <strong>{lop.length}</strong></div>
            <div style={row}><span>Đang mở đăng ký:</span> <strong>{dem('Mở')}</strong></div>
            <div style={row}><span>Chưa mở:</span> <strong>{dem('Chưa mở')}</strong></div>
            <div style={row}><span>Đã đóng / hủy:</span> <strong>{dem('Đóng') + dem('Hủy')}</strong></div>
          </div>
        </div>

        <div style={card}>
          <h4 style={{ margin: '0 0 15px 0', color: '#2c3e50', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Bộ lọc tìm kiếm</h4>
          <div style={{ marginBottom: '15px' }}>
            <strong style={{ fontSize: '14px', display: 'block', marginBottom: '10px' }}>Giảng viên</strong>
            {GIANG_VIEN.map((g) => (
              <label key={g} style={{ display: 'block', fontSize: '13px', marginBottom: '5px' }}>
                <input type="checkbox" checked={locGv.includes(g)} onChange={() => toggle(locGv, setLocGv, g)} /> {g}
              </label>
            ))}
          </div>
          <div style={{ marginBottom: '15px' }}>
            <strong style={{ fontSize: '14px', display: 'block', marginBottom: '10px' }}>Thứ học</strong>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', fontSize: '13px' }}>
              {THU.map((t) => (
                <label key={t}><input type="checkbox" checked={locThu.includes(t)} onChange={() => toggle(locThu, setLocThu, t)} /> {t.replace('Thứ ', '')}</label>
              ))}
            </div>
          </div>
          <button onClick={() => { setLocGv([]); setLocThu([]); setHpChon(null); setTuKhoa(''); }} style={{ width: '100%', padding: '10px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Xóa bộ lọc
          </button>
        </div>
      </div>

      {/* Cột phải */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', minWidth: 0 }}>
        <div style={card}>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
            <div style={{ width: '150px', fontWeight: 'bold', fontSize: '14px' }}>Chương trình đào tạo</div>
            <div style={{ backgroundColor: '#2980b9', color: 'white', padding: '5px 15px', borderRadius: '4px', fontSize: '13px' }}>Đại học Chính quy Khóa 17_4 năm - Công nghệ thông tin</div>
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ width: '150px', fontWeight: 'bold', fontSize: '14px' }}>Kế hoạch</div>
            <div style={{ backgroundColor: dotDangMo ? '#f39c12' : '#7f8c8d', color: 'white', padding: '5px 15px', borderRadius: '4px', fontSize: '13px' }}>
              {dotDangMo ? `${dotDangMo.ma} - ${dotDangMo.ten}` : 'Hiện không có đợt đăng ký nào đang mở'}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {[['lop', 'Quản lý lớp học phần'], ['dot', 'Đợt đăng ký tín chỉ'], ['log', 'Nhật ký hệ thống']].map(([k, t]) => (
            <div key={k} onClick={() => setTab(k)} style={{ padding: '12px 20px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', backgroundColor: tab === k ? '#3b8b40' : 'white', color: tab === k ? 'white' : '#333', border: tab === k ? '1px solid #3b8b40' : '1px solid #eee' }}>{t}</div>
          ))}
        </div>

        {tab === 'lop' && (
          <>
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '15px', flexWrap: 'wrap' }}>
                <strong style={{ fontSize: '16px' }}>Học phần</strong>
                <input type="text" value={tuKhoa} onChange={(e) => setTuKhoa(e.target.value)} placeholder="Tìm kiếm học phần" style={{ flex: 1, minWidth: '150px', padding: '8px 15px', borderRadius: '20px', border: '1px solid #ccc', outline: 'none' }} />
                <button onClick={() => moForm('them')} style={btn('#f39c12', { padding: '8px 18px' })}>+ Thêm mới lớp học phần</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '10px' }}>
                {hpHienThi.map((hp) => (
                  <div key={hp.maHocPhan} onClick={() => setHpChon(hp.maHocPhan === hpChon ? null : hp.maHocPhan)}
                    style={{ padding: '12px 15px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', transition: '0.2s', backgroundColor: hp.maHocPhan === hpChon ? '#3b8b40' : 'transparent', color: hp.maHocPhan === hpChon ? 'white' : '#333', border: hp.maHocPhan === hpChon ? '1px solid #3b8b40' : '1px solid #eee' }}>
                    &gt; {hp.maHocPhan} - {hp.tenHocPhan}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ width: '80px', flexShrink: 0, backgroundColor: '#d5def5', padding: '15px', borderRadius: '8px 0 0 8px', fontWeight: 'bold', color: '#2c3e50', textAlign: 'center', alignSelf: 'stretch' }}>Lớp học phần</div>
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '10px' }}>
                {lopHienThi.length === 0 && <div style={{ padding: '20px', color: '#7f8c8d', fontStyle: 'italic' }}>Chưa có lớp học phần nào phù hợp.</div>}
                {lopHienThi.map((l) => (
                  <div key={l.maLop} style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <div style={{ ...row, alignItems: 'center', marginBottom: '15px', gap: '10px' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#2c3e50' }}>{l.maLop}</div>
                      <Badge tt={l.trangThai} />
                    </div>
                    <div style={{ ...row, flexWrap: 'wrap', gap: '10px', fontSize: '13px', color: '#555', marginBottom: '15px' }}>
                      <div>Giảng viên: <strong>{l.giangVien}</strong></div>
                      <div>Phòng: <strong>{l.phong}</strong></div>
                      <div>Lịch: <strong>{l.thu} - {l.ca}</strong></div>
                      <div>Tổng số: <strong>{l.siSoToiDa}</strong></div>
                      <div>Đã đăng ký: <strong>{l.daDangKy}</strong></div>
                    </div>
                    <div style={{ ...row, alignItems: 'center', borderTop: '1px solid #eee', paddingTop: '15px', flexWrap: 'wrap', gap: '10px' }}>
                      <div style={{ color: '#e74c3c', fontWeight: 'bold' }}>{l.hocPhi}</div>
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <select value={l.trangThai} onChange={(e) => doiTrangThai(l, e.target.value)} style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '13px' }}>
                          {TRANG_THAI.map((t) => <option key={t}>{t}</option>)}
                        </select>
                        <button onClick={() => setModal({ loai: 'chitiet', data: l })} style={btn('#ecf0f1')}>Xem chi tiết</button>
                        <button onClick={() => moForm('sua', l)} style={btn('#3498db')}>Chỉnh sửa</button>
                        <button onClick={() => (l.daDangKy > 0 ? bao('Không thể xóa: lớp đã có sinh viên đăng ký') : setModal({ loai: 'xoa', data: l }))}
                          style={btn(l.daDangKy > 0 ? '#bdc3c7' : '#e74c3c', { cursor: l.daDangKy > 0 ? 'not-allowed' : 'pointer' })}>Xóa</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {tab === 'dot' && (
          <div style={card}>
            <div style={{ ...row, alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '15px' }}>
              <strong style={{ fontSize: '16px' }}>Đợt đăng ký tín chỉ</strong>
              <button onClick={() => { setForm({ ten: '', hocKy: '', batDau: '', ketThuc: '' }); setLoi(''); setModal({ loai: 'dot' }); }} style={btn('#f39c12', { padding: '8px 18px' })}>+ Tạo đợt đăng ký</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {dot.map((d) => (
                <div key={d.ma} style={{ border: '1px solid #eee', borderRadius: '4px', padding: '12px 15px', fontSize: '13px' }}>
                  <div style={{ ...row, alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <strong style={{ color: '#2c3e50' }}>{d.ma} - {d.ten}</strong>
                    <span style={{ backgroundColor: d.trangThai === 'Đang mở' ? '#3b8b40' : '#7f8c8d', color: 'white', padding: '3px 10px', borderRadius: '4px', fontSize: '12px' }}>{d.trangThai}</span>
                  </div>
                  <div style={{ ...row, marginTop: '10px', color: '#555', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
                    <span>Học kỳ: <strong>{d.hocKy}</strong></span>
                    <span>Bắt đầu: <strong>{fmt(d.batDau)}</strong></span>
                    <span>Kết thúc: <strong>{fmt(d.ketThuc)}</strong></span>
                    {d.trangThai === 'Đang mở' && <button onClick={() => dongDot(d)} style={btn('#e74c3c')}>Đóng đợt</button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'log' && (
          <div style={card}>
            <strong style={{ fontSize: '16px', display: 'block', borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '15px' }}>Nhật ký hệ thống</strong>
            {logs.map((g, i) => (
              <div key={i} style={{ ...row, fontSize: '13px', padding: '8px 0', borderBottom: '1px solid #f3f3f3', gap: '15px' }}>
                <span style={{ color: '#34495e' }}>{g.viec}</span>
                <span style={{ color: '#7f8c8d', whiteSpace: 'nowrap' }}>{fmt(g.time)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal thêm/sửa lớp */}
      {(modal?.loai === 'them' || modal?.loai === 'sua') && (() => {
        const sua = modal.loai === 'sua';
        const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
        return (
          <Modal title={sua ? 'Chỉnh sửa lớp học phần' : 'Thêm mới lớp học phần'} onClose={dongModal}>
            <Field label="Mã lớp học phần"><input style={input} value={form.maLop} onChange={set('maLop')} disabled={sua} /></Field>
            <Field label="Tên học phần">
              <input style={input} list="ds-hp" value={form.tenHocPhan} onChange={(e) => { const h = HOC_PHAN.find((x) => x.tenHocPhan === e.target.value); setForm({ ...form, tenHocPhan: e.target.value, ...(h ? { tinChi: h.tinChi } : {}) }); }} disabled={sua} />
              <datalist id="ds-hp">{HOC_PHAN.map((h) => <option key={h.maHocPhan} value={h.tenHocPhan} />)}</datalist>
            </Field>
            <Field label="Số tín chỉ"><input style={input} type="number" value={form.tinChi} onChange={set('tinChi')} disabled={sua} /></Field>
            <Field label="Giảng viên">
              <select style={input} value={form.giangVien} onChange={set('giangVien')}><option value="">-- Chọn giảng viên --</option>{GIANG_VIEN.map((g) => <option key={g}>{g}</option>)}</select>
            </Field>
            <Field label="Phòng học"><input style={input} value={form.phong} onChange={set('phong')} /></Field>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1 }}><Field label="Thứ"><select style={input} value={form.thu} onChange={set('thu')}><option value="">--</option>{THU.map((t) => <option key={t}>{t}</option>)}</select></Field></div>
              <div style={{ flex: 1 }}><Field label="Ca học"><select style={input} value={form.ca} onChange={set('ca')}><option value="">--</option>{CA.map((c) => <option key={c}>{c}</option>)}</select></Field></div>
            </div>
            <Field label="Sĩ số tối đa"><input style={input} type="number" value={form.siSoToiDa} onChange={set('siSoToiDa')} /></Field>
            {!sua && <p style={{ fontSize: '12px', color: '#7f8c8d', margin: '0 0 10px' }}>Lớp mới tạo có trạng thái "Chưa mở" và sinh viên chưa nhìn thấy cho đến khi chuyển sang "Mở".</p>}
            {loi && <div style={{ color: '#e74c3c', fontSize: '13px', marginBottom: '10px' }}>{loi}</div>}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={dongModal} style={btn('#ecf0f1')}>Hủy</button>
              <button onClick={luu} style={btn('#f39c12')}>Lưu</button>
            </div>
          </Modal>
        );
      })()}

      {/* Modal tạo đợt */}
      {modal?.loai === 'dot' && (
        <Modal title="Tạo đợt đăng ký tín chỉ" onClose={dongModal}>
          <Field label="Tên đợt"><input style={input} value={form.ten} onChange={(e) => setForm({ ...form, ten: e.target.value })} /></Field>
          <Field label="Học kỳ"><input style={input} placeholder="VD: HK1 2025-2026" value={form.hocKy} onChange={(e) => setForm({ ...form, hocKy: e.target.value })} /></Field>
          <Field label="Thời gian bắt đầu"><input style={input} type="datetime-local" value={form.batDau} onChange={(e) => setForm({ ...form, batDau: e.target.value })} /></Field>
          <Field label="Thời gian kết thúc"><input style={input} type="datetime-local" value={form.ketThuc} onChange={(e) => setForm({ ...form, ketThuc: e.target.value })} /></Field>
          {loi && <div style={{ color: '#e74c3c', fontSize: '13px', marginBottom: '10px' }}>{loi}</div>}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button onClick={dongModal} style={btn('#ecf0f1')}>Hủy</button>
            <button onClick={taoDot} style={btn('#f39c12')}>Lưu</button>
          </div>
        </Modal>
      )}

      {/* Modal xác nhận xóa */}
      {modal?.loai === 'xoa' && (
        <Modal title="Xác nhận xóa" onClose={dongModal}>
          <p style={{ fontSize: '14px' }}>Bạn có chắc muốn xóa lớp <strong>{modal.data.maLop}</strong>?</p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button onClick={dongModal} style={btn('#ecf0f1')}>Hủy</button>
            <button onClick={xoa} style={btn('#e74c3c')}>Xóa</button>
          </div>
        </Modal>
      )}

      {/* Modal chi tiết */}
      {modal?.loai === 'chitiet' && (
        <Modal title="Chi tiết lớp học phần" onClose={dongModal}>
          <div style={{ fontSize: '14px', color: '#34495e', lineHeight: '2' }}>
            {[['Mã lớp', modal.data.maLop], ['Học phần', `${modal.data.maHocPhan} - ${modal.data.tenHocPhan}`], ['Số tín chỉ', modal.data.tinChi], ['Giảng viên', modal.data.giangVien], ['Phòng học', modal.data.phong], ['Lịch học', `${modal.data.thu} - ${modal.data.ca}`], ['Sĩ số', `${modal.data.daDangKy}/${modal.data.siSoToiDa}`], ['Học phí', modal.data.hocPhi], ['Học kỳ', modal.data.hocKy], ['Trạng thái', modal.data.trangThai]].map(([k, v]) => (
              <div key={k} style={row}><span>{k}:</span> <strong style={{ textAlign: 'right' }}>{v}</strong></div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}