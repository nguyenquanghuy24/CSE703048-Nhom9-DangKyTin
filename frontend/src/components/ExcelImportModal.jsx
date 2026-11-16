import { useMemo, useState } from 'react'
import './ExcelImportModal.css'

const normalize = (value) => String(value ?? '').trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().replace(/[^a-z0-9]/g, '')

export default function ExcelImportModal({ title = 'Nhập dữ liệu bằng Excel', fields, onImport, onClose, hint = '' }) {
  const [fileName, setFileName] = useState('')
  const [rows, setRows] = useState([])
  const [error, setError] = useState('')
  const [skipped, setSkipped] = useState(0)
  const [busy, setBusy] = useState(false)
  const headerLookup = useMemo(() => new Map(fields.flatMap((field) => [[normalize(field.key), field.key], [normalize(field.label), field.key], ...(field.aliases || []).map((alias) => [normalize(alias), field.key])])), [fields])
  const requiredFields = fields.filter((field) => field.required)

  const downloadTemplate = async () => {
    const XLSX = await import('xlsx')
    const worksheet = XLSX.utils.aoa_to_sheet([fields.map((field) => `${field.label}${field.required ? ' *' : ''}`), fields.map((field) => field.example ?? '')])
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Du lieu')
    XLSX.writeFile(workbook, 'mau_nhap_du_lieu.xlsx')
  }

  const readFile = async (file) => {
    setError('')
    setRows([])
    setSkipped(0)
    setFileName(file.name)
    setBusy(true)
    try {
      const XLSX = await import('xlsx')
      const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array', cellDates: false })
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
      if (!firstSheet) throw new Error('Tệp không có trang tính để đọc.')
      const matrix = XLSX.utils.sheet_to_json(firstSheet, { header: 1, defval: '', raw: false })
      const headers = (matrix.shift() || []).map((header) => headerLookup.get(normalize(header)) || '')
      const missing = requiredFields.filter((field) => !headers.includes(field.key))
      if (missing.length) throw new Error(`Thiếu cột bắt buộc: ${missing.map((field) => field.label).join(', ')}. Hãy tải tệp mẫu để xem đúng tên cột.`)
      const parsed = matrix.map((line) => Object.fromEntries(fields.map((field) => {
        const columnIndex = headers.indexOf(field.key)
        const rawValue = columnIndex < 0 ? '' : String(line[columnIndex] ?? '').trim()
        return [field.key, field.parse ? field.parse(rawValue) : rawValue]
      }))).filter((row) => Object.values(row).some(Boolean))
      const valid = parsed.filter((row) => requiredFields.every((field) => row[field.key] !== ''))
      setRows(valid)
      setSkipped(parsed.length - valid.length)
      if (!parsed.length) setError('Tệp chưa có dòng dữ liệu nào bên dưới tiêu đề cột.')
      else if (!valid.length) setError('Không có dòng nào đủ các trường bắt buộc.')
    } catch (cause) {
      setError(cause?.message || 'Không thể đọc tệp. Vui lòng chọn .xlsx, .xls hoặc .csv.')
    } finally {
      setBusy(false)
    }
  }

  const confirmImport = async () => {
    if (!rows.length) return
    await onImport(rows)
    onClose()
  }

  return <div className="excel-import-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <section className="excel-import-dialog" role="dialog" aria-modal="true" aria-labelledby="excel-import-title">
      <header className="excel-import-header"><div><span>NHẬP THEO BẢNG TÍNH</span><h2 id="excel-import-title">{title}</h2></div><button aria-label="Đóng" onClick={onClose}>×</button></header>
      <div className="excel-import-body">
        <div className="excel-import-instructions"><b>1.</b><span>Tải tệp mẫu và giữ nguyên hàng tiêu đề cột.{hint && <small className="excel-import-hint">{hint}</small>}</span><button type="button" onClick={downloadTemplate}>Tải mẫu .xlsx</button></div>
        <label className="excel-file-picker"><input type="file" accept=".xlsx,.xls,.csv" onChange={(event) => event.target.files?.[0] && readFile(event.target.files[0])} /><span className="excel-upload-icon">↑</span><b>{busy ? 'Đang đọc tệp…' : fileName || 'Chọn tệp Excel hoặc CSV'}</b><small>Định dạng .xlsx, .xls hoặc .csv</small></label>
        {error && <p className="excel-import-error" role="alert">{error}</p>}
        {rows.length > 0 && <section className="excel-preview"><div className="excel-preview-heading"><b>Xem trước {rows.length} dòng hợp lệ</b>{skipped > 0 && <span>Bỏ qua {skipped} dòng thiếu thông tin bắt buộc</span>}</div><div className="excel-preview-scroll"><table><thead><tr>{fields.map((field) => <th key={field.key}>{field.label}</th>)}</tr></thead><tbody>{rows.slice(0, 5).map((row, index) => <tr key={`${index}-${row[requiredFields[0]?.key]}`}>{fields.map((field) => <td key={field.key}>{row[field.key] || '—'}</td>)}</tr>)}</tbody></table></div>{rows.length > 5 && <small className="excel-preview-more">Còn {rows.length - 5} dòng sẽ được nhập khi xác nhận.</small>}</section>}
      </div>
      <footer className="excel-import-actions"><button type="button" onClick={onClose}>Hủy</button><button type="button" disabled={!rows.length || busy} onClick={confirmImport}>Nhập {rows.length ? `${rows.length} dòng` : 'dữ liệu'}</button></footer>
    </section>
  </div>
}
