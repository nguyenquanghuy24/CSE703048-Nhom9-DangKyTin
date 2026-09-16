import { useState, useEffect } from 'react'

function App() {
  const [duLieu, setDuLieu] = useState('Đang chờ kết nối từ Spring Boot...')

  useEffect(() => {
    // Gọi API sang cổng 8080 của Backend
    fetch('http://localhost:8080/api/kiem-tra')
      .then(response => response.text())
      .then(data => setDuLieu(data))
      .catch(error => setDuLieu("Lỗi: Không thể kết nối Backend"));
  }, []);

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial' }}>
      <h2>Kiểm tra kết nối Monolith (ReactJS + Spring Boot)</h2>
      <div style={{ padding: '20px', backgroundColor: '#e8f4f8', borderRadius: '8px' }}>
        <p>Phản hồi từ hệ thống: <strong>{duLieu}</strong></p>
      </div>
    </div>
  )
}

export default App