package com.example.demo;

import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * API nền cho các màn hình quản trị. Dữ liệu được giữ trong bộ nhớ để frontend
 * có thể chạy ngay cả khi máy chưa cài MySQL; lớp này là điểm thay thế trực tiếp
 * cho repository JPA khi triển khai production.
 */
@RestController
@RequestMapping("/api/portal")
@CrossOrigin(origins = { "http://localhost:5173", "http://127.0.0.1:5173" })
public class PortalDataController {
    private final Map<String, List<Map<String, Object>>> store = new ConcurrentHashMap<>();
    private final AtomicLong ids = new AtomicLong(1);

    public PortalDataController() {
        store.put("hoc-phan", list(row("ma", "CSE703006", "ten", "Cấu trúc dữ liệu và thuật toán", "tinChi", "3", "khoa", "Khoa CNTT", "trangThai", "Đang mở"), row("ma", "CSE702025", "ten", "Kỹ thuật phần mềm", "tinChi", "3", "khoa", "Khoa CNTT", "trangThai", "Đang mở")));
        store.put("phong-hoc", list(row("ma", "A4-202", "ten", "Phòng A4-202", "toa", "A4", "sucChua", "60", "loai", "Lý thuyết", "trangThai", "Sẵn sàng")));
        store.put("lop-hoc-phan", list(row("ma", "CSE703006.1", "hocPhan", "Cấu trúc dữ liệu và thuật toán", "giangVien", "Nguyễn Văn Anh", "lich", "Thứ 2 · Tiết 1-3", "phong", "B201", "siSo", "38/45", "trangThai", "Đã duyệt")));
        store.put("dot-dang-ky", list(row("ma", "DKH_2025_2026_1", "ten", "Đăng ký học kỳ I", "hocKy", "HK I - 2025/2026", "batDau", "01/11/2025", "ketThuc", "15/11/2025", "trangThai", "Đang mở")));
        store.put("tai-chinh", list(row("ma", "SV001", "hoTen", "Nguyễn Văn An", "hocKy", "HK II - 2025/2026", "phaiThu", "4.050.000 đ", "daNop", "4.050.000 đ", "trangThai", "Đủ điều kiện")));
        store.put("nhat-ky", list(row("thoiGian", "06/11/2026 08:42", "taiKhoan", "admin@edu.vn", "thaoTac", "Duyệt lớp học phần", "doiTuong", "CSE703006.1", "ketQua", "Thành công")));
    }

    @GetMapping("/{module}")
    public List<Map<String, Object>> all(@PathVariable String module) {
        return new ArrayList<>(store.getOrDefault(module, List.of()));
    }

    @PostMapping("/{module}")
    public ResponseEntity<Map<String, Object>> create(@PathVariable String module, @RequestBody Map<String, Object> payload) {
        Map<String, Object> saved = new LinkedHashMap<>(payload);
        saved.putIfAbsent("id", ids.getAndIncrement());
        store.computeIfAbsent(module, ignored -> new ArrayList<>()).add(saved);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{module}/{id}")
    public ResponseEntity<Map<String, Object>> update(@PathVariable String module, @PathVariable String id, @RequestBody Map<String, Object> payload) {
        List<Map<String, Object>> records = store.get(module);
        if (records == null) return ResponseEntity.notFound().build();
        Map<String, Object> replacement = new LinkedHashMap<>(payload);
        replacement.put("id", id);
        for (int index = 0; index < records.size(); index++) {
            if (String.valueOf(records.get(index).get("id")).equals(id) || String.valueOf(index).equals(id)) {
                records.set(index, replacement);
                return ResponseEntity.ok(replacement);
            }
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{module}/{id}")
    public ResponseEntity<Void> delete(@PathVariable String module, @PathVariable String id) {
        List<Map<String, Object>> records = store.get(module);
        if (records == null) return ResponseEntity.notFound().build();
        boolean removed = records.removeIf(record -> String.valueOf(record.get("id")).equals(id) || String.valueOf(records.indexOf(record)).equals(id));
        return removed ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @GetMapping("/health")
    public Map<String, Object> health() {
        return Map.of("status", "UP", "timestamp", Instant.now().toString(), "modules", store.keySet());
    }

    private static List<Map<String, Object>> list(Map<String, Object>... records) { return new ArrayList<>(List.of(records)); }
    private static Map<String, Object> row(Object... values) { Map<String, Object> result = new LinkedHashMap<>(); for (int i = 0; i < values.length; i += 2) result.put(String.valueOf(values[i]), values[i + 1]); return result; }
}
