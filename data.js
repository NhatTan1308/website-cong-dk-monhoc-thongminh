// data.js - File xử lý logic dữ liệu trang Danh sách môn học
const MOCK_DATA = [
  { id: 1, code: 'DB101', name: 'Hệ quản trị cơ sở dữ liệu', type: 'Bắt buộc', credits: 3, teacher: 'TS Nguyễn Thị Như Quỳnh', slots: 40, enrolled: 40 },
  { id: 2, code: 'NT201', name: 'Mạng máy tính cơ bản', type: 'Bắt buộc', credits: 3, teacher: 'ThS Lê Văn A', slots: 45, enrolled: 30 },
  { id: 3, code: 'SE305', name: 'Công nghệ phần mềm ứng dụng', type: 'Tự chọn', credits: 4, teacher: 'TS Trần B', slots: 35, enrolled: 12 },
  { id: 4, code: 'DS102', name: 'Cấu trúc dữ liệu nâng cao', type: 'Bắt buộc', credits: 3, teacher: 'ThS Phạm C', slots: 50, enrolled: 48 },
  { id: 5, code: 'AI101', name: 'Trí tuệ nhân tạo cơ bản', type: 'Tự chọn', credits: 3, teacher: 'TS Đinh D', slots: 40, enrolled: 15 },
  { id: 6, code: 'PR202', name: 'Lập trình Web nâng cao', type: 'Bắt buộc', credits: 4, teacher: 'ThS Nguyễn E', slots: 30, enrolled: 30 },
  { id: 7, code: 'UI301', name: 'Thiết kế Giao diện người dùng', type: 'Tự chọn', credits: 2, teacher: 'TS Phạm F', slots: 25, enrolled: 10 },
  { id: 8, code: 'MA105', name: 'Toán rời rạc', type: 'Bắt buộc', credits: 3, teacher: 'TS Lê G', slots: 50, enrolled: 45 },
  { id: 9, code: 'SE308', name: 'Kiểm thử phần mềm', type: 'Bắt buộc', credits: 3, teacher: 'ThS Trần H', slots: 40, enrolled: 38 },

  // 6 môn học mới thêm dành cho sinh viên CNTT năm 2:
  { id: 10, code: 'OOP201', name: 'Lập trình hướng đối tượng', type: 'Bắt buộc', credits: 4, teacher: 'ThS Phạm Văn I', slots: 45, enrolled: 25 },
  { id: 11, code: 'MA201', name: 'Xác suất thống kê', type: 'Bắt buộc', credits: 3, teacher: 'TS Nguyễn Thị J', slots: 50, enrolled: 50 }, // Môn này đã hết chỗ
  { id: 12, code: 'SE202', name: 'Phân tích thiết kế hệ thống', type: 'Bắt buộc', credits: 3, teacher: 'TS Trần K', slots: 40, enrolled: 35 },
  { id: 13, code: 'OS201', name: 'Hệ điều hành', type: 'Bắt buộc', credits: 3, teacher: 'ThS Lê L', slots: 45, enrolled: 40 },
  { id: 14, code: 'CA201', name: 'Kiến trúc máy tính', type: 'Bắt buộc', credits: 3, teacher: 'TS Vũ M', slots: 40, enrolled: 12 },
  { id: 15, code: 'MA102', name: 'Toán cao cấp - Giải tích', type: 'Bắt buộc', credits: 3, teacher: 'ThS Đinh N', slots: 50, enrolled: 25 }
];

function renderCourses(courses) {
  const grid = document.getElementById("courseGrid");
  if (!grid) return;

  if (courses.length === 0) {
    grid.innerHTML =
      '<p style="grid-column: 1 / -1; text-align: center; color: var(--mute); padding: 40px;">Không tìm thấy môn học nào phù hợp.</p>';
    return;
  }

  grid.innerHTML = courses
    .map((c) => {
      const isFull = c.enrolled >= c.slots;
      const badgeClass = c.type === "Bắt buộc" ? "badge-bb" : "badge-tc";
      const btnClass = isFull ? "btn-full" : "btn-available";
      const btnText = isFull
        ? '<i class="fa-solid fa-lock"></i> Hết chỗ'
        : '<i class="fa-solid fa-plus"></i> Đăng ký';

      return `
      <div class="course-card">
        <span class="course-badge ${badgeClass}">${c.type}</span>
        <h3 class="course-title">${c.name}</h3>
        <div class="course-info">
          <span><i class="fa-solid fa-barcode"></i> Mã môn: <b>${c.code}</b></span>
          <span><i class="fa-solid fa-chalkboard-user"></i> Giảng viên: ${c.teacher}</span>
          <span><i class="fa-solid fa-coins"></i> Tín chỉ: ${c.credits}</span>
          <span><i class="fa-solid fa-user-group"></i> Sĩ số: <b>${c.enrolled}/${c.slots}</b></span>
        </div>
        <button class="btn-act ${btnClass}" ${isFull ? "disabled" : ""}>${btnText}</button>
      </div>
    `;
    })
    .join("");
}

function initCoursePage() {
  const searchInput = document.getElementById("searchInput");
  const filterSelect = document.getElementById("filterSelect");

  function filterData() {
    const text = searchInput.value.toLowerCase();
    const type = filterSelect.value;

    const filtered = MOCK_DATA.filter((c) => {
      const matchText =
        c.name.toLowerCase().includes(text) ||
        c.code.toLowerCase().includes(text);
      const matchType = type === "all" || c.type === type;
      return matchText && matchType;
    });

    renderCourses(filtered);
  }

  if (searchInput) searchInput.addEventListener("input", filterData);
  if (filterSelect) filterSelect.addEventListener("change", filterData);

  renderCourses(MOCK_DATA);
}

document.addEventListener("DOMContentLoaded", initCoursePage);
