# Ánh xạ học phần trong chương trình đào tạo

`curriculumMappings.json` là dữ liệu cố định, được giao diện chỉ đọc và đóng gói cùng frontend. Hiện file có các môn gợi ý theo khoa phụ trách, được gắn nhãn `Gợi ý theo khoa · cần xác nhận`.

Workbook không có ma trận chính thức học phần–CTĐT. Các dòng hiện tại chỉ giúp xem danh mục môn của cùng khoa trong từng ngành; chúng không khẳng định môn bắt buộc hay tự chọn. Khối kiến thức và tiên quyết/song hành cũng để trống hoặc chưa xác định. Cần thay bằng danh sách đã được khoa duyệt trước khi dùng làm quy tắc đăng ký.

Mỗi dòng dùng cấu trúc:

```json
{
  "programId": "480201-2023",
  "courseCode": "CSE701012",
  "knowledgeBlock": "Chưa phân loại",
  "requirement": "Chưa xác định",
  "prerequisites": "",
  "coRequisites": "",
  "mappingStatus": "Gợi ý theo khoa · cần xác nhận"
}
```

Một mã học phần có thể xuất hiện ở nhiều CTĐT. Khi có ma trận đã duyệt, cập nhật các dòng ở file này; không cần thêm chức năng chỉnh sửa trong giao diện.
