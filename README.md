# P.K.A Student Portal – Hệ thống đăng ký tín chỉ

Ứng dụng web mô phỏng cổng học vụ dùng để đăng nhập theo vai trò, đăng ký học phần, xem thời khóa biểu và hỗ trợ các nghiệp vụ quản trị đào tạo, cơ sở vật chất, tài chính và tài khoản.

> Đây là bản prototype/demo phục vụ học tập và trình diễn. Một số dữ liệu đang được khởi tạo từ mã nguồn hoặc lưu trong bộ nhớ trình duyệt/backend, chưa phải hệ thống production hoàn chỉnh.

## 1. Mục tiêu và phạm vi

| Vai trò | Chức năng chính | Trang mặc định |
| --- | --- | --- |
| Sinh viên | Tra cứu học phần, đăng ký/hủy lớp, xem thời khóa biểu | `/sinh-vien/dang-ky` |
| Quản trị viên | Quản lý tài khoản, phân quyền, khóa/mở khóa, nhật ký thao tác | `/admin` |
| Phòng Đào tạo | Quản lý lớp học phần và các đợt đăng ký | `/admin/dao-tao?module=dot-dang-ky` |
| Quản lý Khoa/Ngành | Quản lý học phần và lớp học phần | `/admin/dao-tao?module=hoc-phan` |
| Quản lý CSVC | Theo dõi, thêm và cập nhật phòng học | `/quan-ly-csvc` |
| Quản lý Tài chính | Theo dõi công nợ và cập nhật số tiền sinh viên đã nộp | `/tai-chinh` |

## 2. Công nghệ sử dụng

### Frontend

- React 19 và React DOM.
- Vite 8 để chạy development server và build production.
- React Router DOM 7 để điều hướng và bảo vệ route theo vai trò.
- SheetJS (`xlsx`) để đọc/ghi `.xlsx`, `.xls`, `.csv` ở trình duyệt.
- CSS thuần, tổ chức theo page/component.
- Oxlint cho kiểm tra mã nguồn.

### Backend

- Java 17 và Spring Boot 4.1.1.
- Spring Web MVC cho REST API.
- Spring Data JPA và MySQL Connector/J đã được khai báo cho hướng mở rộng dữ liệu thật.
- H2 được dùng trong test.
- Gradle Wrapper 9.7.1.

## 3. Kiến trúc tổng quan

```text
Browser
  └── React/Vite :5173
        ├── React Router: route + kiểm tra session/role
        ├── localStorage: portal-session, student-registered
        └── REST fetch ──> Spring Boot :8080
                              └── /api/portal/{module}
                                  dữ liệu demo trong bộ nhớ
```

Frontend có thể chạy độc lập nhờ dữ liệu seed và cơ chế fallback local. Khi backend hoạt động, phân hệ quản trị đào tạo sẽ đọc/ghi dữ liệu qua API `/api/portal`. Backend hiện chưa có entity/repository nghiệp vụ; `PortalDataController` đang dùng `ConcurrentHashMap`, vì vậy dữ liệu API sẽ mất khi ứng dụng Spring Boot khởi động lại.

## 4. Luồng hoạt động chi tiết

### 4.1. Khởi động và đăng nhập

1. Người dùng truy cập `/` hoặc một route bất kỳ.
2. Nếu chưa có `portal-session` trong `localStorage`, ứng dụng chuyển tới `/login`.
3. Người dùng chọn vai trò, nhập username/email và mật khẩu.
4. Frontend đối chiếu với danh sách tài khoản demo trong `LoginPage.jsx`.
5. Đăng nhập đúng tạo session gồm `role`, `username`, `email` và `loggedInAt`.
6. `RequireRole` kiểm tra session và role trước khi render route. Nếu role không phù hợp, người dùng được đưa về trang mặc định của role hiện tại.
7. Đăng xuất xóa `portal-session` và quay lại `/login`.

### 4.2. Luồng sinh viên đăng ký học phần

1. Sinh viên vào **Đăng ký học phần**. Danh sách học phần được lấy từ mảng dữ liệu mẫu trong frontend.
2. Có thể tìm theo mã/tên và lọc theo ngày học.
3. Bấm vào học phần để mở danh sách lớp, xem giảng viên, lịch, phòng và sĩ số.
4. Khi đăng ký, hệ thống kiểm tra lớp đủ sĩ số, trùng lớp đã đăng ký, giới hạn tối đa 24 tín chỉ và trùng ngày/tiết.
5. Nếu hợp lệ, hệ thống mở hộp thoại xác nhận rồi ghi lớp vào `localStorage.student-registered`.
6. Tab **Học phần đã đăng ký** cho phép xem danh sách và hủy đăng ký sau khi xác nhận.
7. Thao tác thành công hiển thị thông báo tạm thời trên giao diện.

### 4.3. Luồng xem thời khóa biểu

1. Trang `/sinh-vien/thoi-khoa-bieu` đọc các lớp từ `student-registered`.
2. Nếu chưa có dữ liệu đăng ký, trang dùng danh sách fallback để minh họa giao diện.
3. Các lớp được đặt vào lưới từ Thứ 2 đến Thứ 7 theo tiết học.
4. Bấm vào một lớp để xem mã lớp, học phần, tín chỉ, giảng viên, lịch và phòng.
5. Có thể chọn học kỳ và dùng chức năng in của trình duyệt.

### 4.4. Luồng quản trị tài khoản

Quản trị viên vào `/admin` để xem số liệu tổng quan; lọc/tìm tài khoản; xem chi tiết; sửa; khóa/mở khóa; xóa; tạo thủ công; hoặc nhập nhiều tài khoản từ Excel/CSV. Luồng nhập bảng tính gồm tải file mẫu, chọn file, kiểm tra cột bắt buộc, xem trước dữ liệu hợp lệ, bỏ qua dòng lỗi và xác nhận nhập. Nhật ký ghi nhận các thao tác phát sinh trong phiên giao diện hiện tại.

Dữ liệu tài khoản và nhật ký hiện chỉ nằm trong state của `AdminPage`, nên sẽ trở về dữ liệu seed khi reload trang.

### 4.5. Luồng quản lý đào tạo

Trang dùng chung `/admin/dao-tao?module=...`, trong đó module quyết định bảng dữ liệu:

- `hoc-phan`: mã, tên, tín chỉ, khoa phụ trách, trạng thái;
- `phong-hoc`: mã/tên phòng, tòa nhà, sức chứa, loại phòng, trạng thái;
- `lop-hoc-phan`: học phần, giảng viên, lịch, phòng, sĩ số, trạng thái;
- `dot-dang-ky`: tên đợt, học kỳ, thời gian bắt đầu/kết thúc, trạng thái;
- `tai-chinh`: mã sinh viên, học kỳ, phải thu, đã nộp, trạng thái;
- `nhat-ky`: thời gian, tài khoản, thao tác, đối tượng, kết quả.

Mỗi module hỗ trợ tìm kiếm, thêm thủ công, sửa, xóa và nhập Excel/CSV. Khi mở module, frontend gọi:

```text
GET    http://localhost:8080/api/portal/{module}
POST   http://localhost:8080/api/portal/{module}
PUT    http://localhost:8080/api/portal/{module}/{id}
DELETE http://localhost:8080/api/portal/{module}/{id}
```

Nếu backend không khả dụng, frontend giữ seed data và vẫn cho phép thao tác trong state cục bộ của trang.

| Vai trò | Module được phép |
| --- | --- |
| ADMIN | Tất cả module |
| TRAINING | `lop-hoc-phan`, `dot-dang-ky` |
| DEPARTMENT | `hoc-phan`, `lop-hoc-phan` |
| FACILITIES | `phong-hoc` |
| FINANCE | `tai-chinh` |

### 4.6. Luồng quản lý cơ sở vật chất

Trang `/quan-ly-csvc` hiển thị tổng số phòng, phòng sẵn sàng, đang sử dụng và bảo trì. Người dùng có thể tìm theo mã/tòa nhà/loại phòng, lọc theo trạng thái, thêm phòng thủ công hoặc bằng file bảng tính, chỉnh sửa thông tin và in danh sách. Dữ liệu hiện được lưu trong state React của trang.

### 4.7. Luồng tài chính

Trang `/tai-chinh` hiển thị tổng phải thu, đã thu, còn phải thu và số sinh viên hoàn thành. Có thể tìm theo mã/tên, lọc theo trạng thái, cập nhật số tiền đã nộp bằng hộp thoại nhập số và in báo cáo. Trạng thái tự động tính lại thành **Đã hoàn thành**, **Còn công nợ** hoặc **Chưa thanh toán**. Phân hệ chỉ theo dõi công nợ, chưa xử lý thanh toán trực tuyến.

## 5. Tài khoản demo

| Vai trò | Username | Email | Mật khẩu |
| --- | --- | --- | --- |
| Sinh viên | `SV001` | `sinhvien@edu.vn` | `sv123` |
| Quản trị viên | `admin` | `admin@edu.vn` | `admin123` |
| Phòng Đào tạo | `pdt` | `pdt@edu.vn` | `pdt123` |
| Khoa/Ngành | `khoa` | `khoa@edu.vn` | `khoa123` |
| CSVC | `csvc` | `csvc@edu.vn` | `csvc123` |
| Tài chính | `taichinh` | `taichinh@edu.vn` | `tc123` |

## 6. Yêu cầu môi trường

- Node.js 18+ và npm (hoặc pnpm).
- JDK 17+.
- Không bắt buộc MySQL để chạy demo frontend và API in-memory.
- Nếu muốn dùng cấu hình database hiện tại, cần MySQL/XAMPP với database `phan_mem_dang_ky_tin_chi`, user `root`, password `12345` hoặc sửa `backend/src/main/resources/application.properties`.

## 7. Cài đặt và chạy

### Frontend

Mở terminal tại thư mục `frontend`:

```bash
npm install
npm run dev
```

Truy cập địa chỉ Vite hiển thị trên terminal, thường là `http://localhost:5173`.

```bash
npm run build    # build production vào frontend/dist
npm run preview  # chạy thử bản build
npm run lint     # kiểm tra mã nguồn bằng Oxlint
```

### Backend

Mở terminal thứ hai tại thư mục `backend`:

Windows PowerShell:

```powershell
./gradlew.bat bootRun
```

macOS/Linux:

```bash
./gradlew bootRun
```

Backend mặc định chạy tại `http://localhost:8080`.

Kiểm tra nhanh: `GET /api/kiem-tra`, `GET /api/portal/health` và `GET /api/portal/hoc-phan`.

Chạy test backend:

```powershell
./gradlew.bat test
```

## 8. Cấu trúc thư mục

```text
.
├── frontend/
│   ├── src/
│   │   ├── components/       # layout sinh viên, modal, import Excel
│   │   ├── pages/            # login, sinh viên và các phân hệ quản trị
│   │   ├── App.jsx           # router và phân quyền route
│   │   └── main.jsx          # entry point React
│   ├── public/               # favicon, sprite/icon dùng chung
│   ├── package.json
│   └── vite.config.js
└── backend/
    ├── src/main/java/com/example/demo/
    │   ├── DemoApplication.java
    │   ├── PortalDataController.java
    │   └── HocPhanController.java
    ├── src/main/resources/application.properties
    ├── build.gradle
    └── gradlew[.bat]
```

## 9. API backend

`PortalDataController` có base path `/api/portal`:

| Method | Endpoint | Ý nghĩa |
| --- | --- | --- |
| `GET` | `/api/portal/health` | Kiểm tra trạng thái và danh sách module |
| `GET` | `/api/portal/{module}` | Lấy toàn bộ bản ghi của module |
| `POST` | `/api/portal/{module}` | Thêm bản ghi, tự cấp `id` nếu thiếu |
| `PUT` | `/api/portal/{module}/{id}` | Thay thế bản ghi theo `id` hoặc index |
| `DELETE` | `/api/portal/{module}/{id}` | Xóa bản ghi theo `id` hoặc index |
| `GET` | `/api/kiem-tra` | Endpoint kiểm tra kết nối Spring Boot |

CORS hiện cho phép frontend từ `http://localhost:5173` và `http://127.0.0.1:5173`.

## 10. Lưu ý khi phát triển tiếp

- Đăng nhập hiện là xác thực phía client với tài khoản hard-code; không dùng cho môi trường thật.
- Cần bổ sung Spring Security/JWT hoặc session server-side trước khi triển khai production.
- Cần tạo entity, repository, service, migration/schema và API nghiệp vụ để dữ liệu không mất khi restart.
- Nên chuyển dữ liệu seed và thông tin nhạy cảm ra biến môi trường/config bảo mật.
- Nên bổ sung validation backend, phân trang, kiểm tra trùng lịch/sĩ số ở server và transaction cho đăng ký học phần.
- Các thay đổi ở tài khoản admin, CSVC và tài chính hiện chưa đồng bộ giữa người dùng hoặc sau khi reload.
- Mật khẩu MySQL trong file cấu hình chỉ phù hợp môi trường local; cần đổi ngay khi triển khai thật.
