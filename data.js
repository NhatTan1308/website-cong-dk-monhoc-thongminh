// data.js - File xử lý logic dữ liệu trang Danh sách môn học
const MOCK_DATA = [
  {
    id: 1,
    code: "DB101",
    name: "Hệ quản trị cơ sở dữ liệu",
    type: "Bắt buộc",
    credits: 3,
    teacher: "TS Nguyễn Thị Như Quỳnh",
    slots: 40,
    enrolled: 40,
  },
  {
    id: 2,
    code: "NT201",
    name: "Mạng máy tính cơ bản",
    type: "Bắt buộc",
    credits: 3,
    teacher: "ThS Lê Văn A",
    slots: 45,
    enrolled: 30,
  },
  {
    id: 3,
    code: "SE305",
    name: "Công nghệ phần mềm ứng dụng",
    type: "Tự chọn",
    credits: 4,
    teacher: "TS Trần B",
    slots: 35,
    enrolled: 12,
  },
  {
    id: 4,
    code: "DS102",
    name: "Cấu trúc dữ liệu nâng cao",
    type: "Bắt buộc",
    credits: 3,
    teacher: "ThS Phạm C",
    slots: 50,
    enrolled: 48,
  },
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
