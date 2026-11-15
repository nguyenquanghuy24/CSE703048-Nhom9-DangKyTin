import './AddMethodChooser.css'

export default function AddMethodChooser({ title = 'Thêm dữ liệu', onManual, onExcel, onClose }) {
  return <div className="add-method-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <section className="add-method-dialog" role="dialog" aria-modal="true" aria-labelledby="add-method-title">
      <header><div><span>CHỌN CÁCH THÊM</span><h2 id="add-method-title">{title}</h2></div><button aria-label="Đóng" onClick={onClose}>×</button></header>
      <div className="add-method-options">
        <button onClick={onManual}><span className="add-method-icon">＋</span><span><b>Thêm thủ công</b><small>Nhập thông tin vào biểu mẫu</small></span><i>→</i></button>
        <button onClick={onExcel}><span className="add-method-icon sheet">▤</span><span><b>Thêm bằng Excel</b><small>Tải tệp lên, xem trước rồi xác nhận</small></span><i>→</i></button>
      </div>
      <footer>Hỗ trợ tệp .xlsx, .xls và .csv</footer>
    </section>
  </div>
}
