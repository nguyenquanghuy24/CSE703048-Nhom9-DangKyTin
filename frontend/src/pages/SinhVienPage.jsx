import React, { useState } from 'react';

export default function SinhVienPage() {
  // Trạng thái lưu trữ môn học 
  const [monHocDuocChon, setMonHocDuocChon] = useState(null);

  const danhSachHocPhan = [
    {
      maHocPhan: 'CSE703006',
      tenHocPhan: 'Cấu trúc dữ liệu và thuật toán(Học đi)',
      lopHocPhan: [
        { maLop: 'Cấu trúc dữ liệu và thuật toán-1-3-24(COUR01)', loai: 'Lý thuyết', thu: 'Thứ 2', tongSo: 100, daDangKy: 90, hocPhi: '1,577,250 đ' },
        { maLop: 'Cấu trúc dữ liệu và thuật toán-2-3-24(COUR02)', loai: 'Lý thuyết', thu: 'Thứ 4', tongSo: 100, daDangKy: 100, hocPhi: '1,577,250 đ' }
      ]
    },
    {
      maHocPhan: 'CSE702025',
      tenHocPhan: 'Kỹ thuật phần mềm(Học đi)',
      lopHocPhan: [
        { maLop: 'Kỹ thuật phần mềm-1-3-24(COUR01)', loai: 'Lý thuyết', thu: 'Thứ 3', tongSo: 500, daDangKy: 0, hocPhi: '1,577,250 đ' }
      ]
    },
    {
      maHocPhan: 'CSE702017',
      tenHocPhan: 'Hệ điều hành(Học đi)',
      lopHocPhan: [
        { maLop: 'Hệ điều hành-1-3-24(COUR01)', loai: 'Lý thuyết', thu: 'Thứ 5', tongSo: 60, daDangKy: 15, hocPhi: '1,577,250 đ' }
      ]
    },
    {
      maHocPhan: 'CSE703023',
      tenHocPhan: 'Kiến trúc máy tính(Học đi)',
      lopHocPhan: []
    }
  ];

  return (
    <div style={{ display: 'flex', gap: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#eef2f6', padding: '20px', minHeight: '100vh', flexWrap: 'wrap' }}>
{/* Cột trái */}
      <div style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '20px', flexShrink: 0 }}>
        
        {/* Box Thông tin cá nhân */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '15px' }}>
            <div style={{ width: '60px', height: '60px', backgroundColor: '#ccc', borderRadius: '50%' }}></div>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#2c3e50' }}>Nguyễn Quang Huy</h3>
              <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#7f8c8d' }}>23010446</p>
            </div>
          </div>
          <div style={{ fontSize: '14px', color: '#34495e', lineHeight: '2' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Số dư tài khoản hiện tại:</span> <strong>0</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Số phát sinh thêm trong đợt:</span> <strong>0</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Tổng lớp đã đăng ký:</span> <strong>0</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Số tín chỉ đã đăng ký:</span> <strong>0</strong></div>
          </div>
        </div>

        {/* Box Bộ lọc tìm kiếm */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h4 style={{ margin: '0 0 15px 0', color: '#2c3e50', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Bộ lọc tìm kiếm</h4>
          
          <div style={{ marginBottom: '15px' }}>
            <strong style={{ fontSize: '14px', display: 'block', marginBottom: '10px' }}>Giảng viên</strong>
            <label style={{ display: 'block', fontSize: '13px', marginBottom: '5px' }}><input type="checkbox" /> Trịnh Thanh Bình</label>
            <label style={{ display: 'block', fontSize: '13px', marginBottom: '5px' }}><input type="checkbox" /> Vũ Quang Dũng</label>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <strong style={{ fontSize: '14px', display: 'block', marginBottom: '10px' }}>Thứ học</strong>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', fontSize: '13px' }}>
              <label><input type="checkbox" /> 2</label>
              <label><input type="checkbox" /> 3</label>
              <label><input type="checkbox" /> 4</label>
              <label><input type="checkbox" /> 5</label>
            </div>
          </div>
          
          <button style={{ width: '100%', padding: '10px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Tìm kiếm
          </button>
        </div>
      </div>

{/*Cột phải*/}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Banner Kế hoạch học tập */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
            <div style={{ width: '150px', fontWeight: 'bold', fontSize: '14px' }}>Chương trình đào tạo</div>
            <div style={{ backgroundColor: '#2980b9', color: 'white', padding: '5px 15px', borderRadius: '4px', fontSize: '13px' }}>Đại học Chính quy Khóa 17_4 năm - Công nghệ thông tin</div>
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ width: '150px', fontWeight: 'bold', fontSize: '14px' }}>Kế hoạch</div>
            <div style={{ backgroundColor: '#f39c12', color: 'white', padding: '5px 15px', borderRadius: '4px', fontSize: '13px' }}>DKH_2024_2025_3.1 - Đăng ký học HK3 (Đợt học 1_K17)</div>
          </div>
        </div>

        {/* Khu vực Chọn Học Phần */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
            <strong style={{ fontSize: '16px' }}>Học phần</strong>
            <input type="text" placeholder="Tìm kiếm học phần" style={{ flex: 1, padding: '8px 15px', borderRadius: '20px', border: '1px solid #ccc', outline: 'none' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '10px' }}>
            {danhSachHocPhan.map((hp) => (
              <div 
                key={hp.maHocPhan}
                onClick={() => setMonHocDuocChon(hp.maHocPhan === monHocDuocChon ? null : hp.maHocPhan)}
                style={{
                  padding: '12px 15px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  transition: '0.2s',
                  backgroundColor: hp.maHocPhan === monHocDuocChon ? '#3b8b40' : 'transparent',
                  color: hp.maHocPhan === monHocDuocChon ? 'white' : '#333',
                  border: hp.maHocPhan === monHocDuocChon ? '1px solid #3b8b40' : '1px solid #eee'
                }}
              >
                &gt; {hp.maHocPhan} - {hp.tenHocPhan}
              </div>
            ))}
          </div>
        </div>

{/*Lớp Học Phần dropdown*/}
        {monHocDuocChon && (
          <div style={{ backgroundColor: '#eef2f6', padding: '0', borderRadius: '8px', animation: 'fadeIn 0.3s ease-in-out' }}>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ width: '80px', backgroundColor: '#d5def5', padding: '15px', borderRadius: '8px 0 0 8px', fontWeight: 'bold', color: '#2c3e50', textAlign: 'center' }}>
                Lớp học phần
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '10px' }}>
                {danhSachHocPhan.find(hp => hp.maHocPhan === monHocDuocChon).lopHocPhan.length > 0 ? (
                  danhSachHocPhan.find(hp => hp.maHocPhan === monHocDuocChon).lopHocPhan.map((lop, index) => (
                    <div key={index} style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '15px', color: '#2c3e50' }}>{lop.maLop}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#555', marginBottom: '15px' }}>
                        <div>Lý thuyết: <strong>{lop.loai}</strong></div>
                        <div>Thứ: <strong>{lop.thu}</strong></div>
                        <div>Tổng số: <strong>{lop.tongSo}</strong></div>
                        <div>Đã đăng ký: <strong>{lop.daDangKy}</strong></div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                        <div style={{ color: '#e74c3c', fontWeight: 'bold' }}>{lop.hocPhi}</div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button style={{ padding: '6px 15px', backgroundColor: '#ecf0f1', color: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}>Xem chi tiết</button>
                          <button 
                            disabled={lop.daDangKy >= lop.tongSo}
                            style={{ padding: '6px 15px', backgroundColor: lop.daDangKy >= lop.tongSo ? '#bdc3c7' : '#f39c12', color: 'white', border: 'none', borderRadius: '4px', cursor: lop.daDangKy >= lop.tongSo ? 'not-allowed' : 'pointer', fontSize: '13px' }}>
                            {lop.daDangKy >= lop.tongSo ? 'Hết chỗ' : 'Chọn thêm 1 lớp'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '20px', color: '#7f8c8d', fontStyle: 'italic' }}>Chưa có lớp học phần nào được mở cho môn này.</div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}