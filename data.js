const MOCK_DATA = [
  // Ngành Công Nghệ Thông Tin
  { id: 1, code: 'IT201', name: 'Cấu trúc dữ liệu và giải thuật', major: 'Công Nghệ Thông Tin', type: 'Bắt buộc', credits: 4, teacher: 'TS Nguyễn Thị Như Quỳnh', slots: 40, enrolled: 40 },
  { id: 2, code: 'IT202', name: 'Mạng máy tính', major: 'Công Nghệ Thông Tin', type: 'Bắt buộc', credits: 3, teacher: 'ThS Lê Văn A', slots: 45, enrolled: 30 },
  { id: 3, code: 'IT301', name: 'Công nghệ phần mềm', major: 'Công Nghệ Thông Tin', type: 'Bắt buộc', credits: 3, teacher: 'TS Trần B', slots: 40, enrolled: 35 },
  { id: 4, code: 'IT302', name: 'Lập trình hướng đối tượng', major: 'Công Nghệ Thông Tin', type: 'Bắt buộc', credits: 4, teacher: 'ThS Phạm Văn I', slots: 45, enrolled: 25 },
  { id: 17, code: 'IT401', name: 'Lập trình thiết bị di động', major: 'Công Nghệ Thông Tin', type: 'Tự chọn', credits: 3, teacher: 'ThS Lê L', slots: 40, enrolled: 30 },
  { id: 18, code: 'IT402', name: 'An toàn thông tin', major: 'Công Nghệ Thông Tin', type: 'Bắt buộc', credits: 3, teacher: 'TS Vũ M', slots: 45, enrolled: 42 },

  // Ngành Trí Tuệ Nhân Tạo
  { id: 5, code: 'AI201', name: 'Nhập môn Trí tuệ nhân tạo', major: 'Trí Tuệ Nhân Tạo', type: 'Bắt buộc', credits: 3, teacher: 'TS Đinh D', slots: 40, enrolled: 15 },
  { id: 6, code: 'AI301', name: 'Học máy (Machine Learning)', major: 'Trí Tuệ Nhân Tạo', type: 'Bắt buộc', credits: 4, teacher: 'ThS Nguyễn E', slots: 30, enrolled: 30 },
  { id: 7, code: 'AI302', name: 'Xử lý ngôn ngữ tự nhiên', major: 'Trí Tuệ Nhân Tạo', type: 'Tự chọn', credits: 3, teacher: 'TS Phạm F', slots: 35, enrolled: 10 },
  { id: 8, code: 'AI401', name: 'Mạng nơ-ron nhân tạo', major: 'Trí Tuệ Nhân Tạo', type: 'Bắt buộc', credits: 3, teacher: 'TS Trần K', slots: 35, enrolled: 20 },
  { id: 19, code: 'AI402', name: 'Thị giác máy tính', major: 'Trí Tuệ Nhân Tạo', type: 'Tự chọn', credits: 3, teacher: 'TS Nguyễn Thị J', slots: 30, enrolled: 12 },
  { id: 20, code: 'AI403', name: 'Robotics cơ bản', major: 'Trí Tuệ Nhân Tạo', type: 'Tự chọn', credits: 3, teacher: 'ThS Phạm C', slots: 25, enrolled: 25 },

  // Ngành Thương Mại Điện Tử
  { id: 9, code: 'EC101', name: 'Tổng quan Thương mại điện tử', major: 'Thương Mại Điện Tử', type: 'Bắt buộc', credits: 3, teacher: 'TS Lê G', slots: 50, enrolled: 45 },
  { id: 10, code: 'EC202', name: 'Marketing số', major: 'Thương Mại Điện Tử', type: 'Bắt buộc', credits: 3, teacher: 'ThS Trần H', slots: 40, enrolled: 38 },
  { id: 11, code: 'EC301', name: 'Quản trị chuỗi cung ứng', major: 'Thương Mại Điện Tử', type: 'Tự chọn', credits: 3, teacher: 'TS Vũ M', slots: 45, enrolled: 20 },
  { id: 12, code: 'EC302', name: 'Hệ thống thanh toán điện tử', major: 'Thương Mại Điện Tử', type: 'Bắt buộc', credits: 3, teacher: 'ThS Nguyễn E', slots: 45, enrolled: 45 },
  { id: 21, code: 'EC401', name: 'Hành vi người tiêu dùng', major: 'Thương Mại Điện Tử', type: 'Tự chọn', credits: 3, teacher: 'TS Đinh D', slots: 40, enrolled: 28 },
  { id: 22, code: 'EC402', name: 'Phân tích dữ liệu kinh doanh', major: 'Thương Mại Điện Tử', type: 'Bắt buộc', credits: 3, teacher: 'TS Lê Văn A', slots: 40, enrolled: 35 },

  // Ngành Truyền Thông Đa Phương Tiện
  { id: 13, code: 'MD201', name: 'Thiết kế đồ họa cơ bản', major: 'Truyền Thông Đa Phương Tiện', type: 'Bắt buộc', credits: 3, teacher: 'ThS Phạm Văn I', slots: 40, enrolled: 25 },
  { id: 14, code: 'MD202', name: 'Xử lý âm thanh và video', major: 'Truyền Thông Đa Phương Tiện', type: 'Bắt buộc', credits: 3, teacher: 'TS Nguyễn Thị J', slots: 40, enrolled: 40 },
  { id: 15, code: 'MD301', name: 'Sản xuất nội dung số', major: 'Truyền Thông Đa Phương Tiện', type: 'Tự chọn', credits: 4, teacher: 'TS Trần K', slots: 35, enrolled: 15 },
  { id: 16, code: 'MD302', name: 'Kỹ xảo điện ảnh (VFX)', major: 'Truyền Thông Đa Phương Tiện', type: 'Bắt buộc', credits: 3, teacher: 'TS Trần B', slots: 30, enrolled: 25 },
  { id: 23, code: 'MD401', name: 'Hoạt hình 3D', major: 'Truyền Thông Đa Phương Tiện', type: 'Tự chọn', credits: 4, teacher: 'ThS Lê G', slots: 30, enrolled: 30 },
  { id: 24, code: 'MD402', name: 'Nhiếp ảnh thương mại', major: 'Truyền Thông Đa Phương Tiện', type: 'Tự chọn', credits: 3, teacher: 'ThS Trần H', slots: 35, enrolled: 20 }
];

// Quản lý danh sách các môn đã đăng ký của sinh viên (lưu vào localStorage)
const registeredCourseIds = new Set(
  (() => {
    try {
      return JSON.parse(localStorage.getItem('sc_registered_courses') || '[]');
    } catch {
      return [];
    }
  })()
);

function saveRegisteredState() {
  try {
    localStorage.setItem('sc_registered_courses', JSON.stringify([...registeredCourseIds]));
  } catch (e) {
    console.error('Không thể lưu trạng thái đăng ký:', e);
  }
}

// Đồng bộ sĩ số ban đầu nếu sinh viên đã có môn đăng ký từ phiên trước
registeredCourseIds.forEach(id => {
  const course = MOCK_DATA.find(c => c.id === id);
  if (course && course.enrolled < course.slots) {
    course.enrolled += 1;
  }
});

// Hàm hiển thị thông báo toast nổi mượt mà
function showToast(message, type = 'success') {
  let toast = document.getElementById('sc-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'sc-toast';
    toast.className = 'sc-toast';
    document.body.appendChild(toast);
  }

  let icon = 'fa-circle-check';
  if (type === 'error') icon = 'fa-circle-xmark';
  if (type === 'info') icon = 'fa-circle-info';

  toast.className = `sc-toast ${type} show`;
  toast.innerHTML = `<i class="fa-solid ${icon}"></i><span>${message}</span>`;

  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

// Xử lý khi sinh viên nhấn Đăng ký / Hủy đăng ký (mỗi môn chỉ đăng ký tối đa 1 lần)
function registerCourse(courseId) {
  const course = MOCK_DATA.find(c => c.id === courseId);
  if (!course) return;

  // Trường hợp 1: Môn này ĐÃ ĐƯỢC sinh viên đăng ký trước đó -> Nhấn vào sẽ HỦY ĐĂNG KÝ
  if (registeredCourseIds.has(courseId)) {
    registeredCourseIds.delete(courseId);
    course.enrolled = Math.max(0, course.enrolled - 1);
    saveRegisteredState();
    showToast(`Đã hủy đăng ký môn: [${course.code}] ${course.name}`, 'info');

    if (typeof window.applyCourseFilter === 'function') {
      window.applyCourseFilter();
    }
    return;
  }

  // Trường hợp 2: Lớp học đã hết chỗ
  if (course.enrolled >= course.slots) {
    showToast(`Môn [${course.code}] ${course.name} đã đủ sĩ số!`, 'error');
    return;
  }

  // Trường hợp 3: Đăng ký thành công lần đầu cho môn này
  registeredCourseIds.add(courseId);
  course.enrolled += 1;
  saveRegisteredState();
  showToast(`Đăng ký thành công môn: [${course.code}] ${course.name}`, 'success');

  // Cập nhật lại giao diện ngay lập tức
  if (typeof window.applyCourseFilter === 'function') {
    window.applyCourseFilter();
  }
}

// Đóng/Mở popup xem danh sách môn đã chọn
function toggleSelectedModal() {
  const modal = document.getElementById('selectedModal');
  if (modal) {
    modal.classList.toggle('hidden');
  }
}

// Cập nhật thống kê số môn & tín chỉ đã đăng ký lên cả Header & Thanh nổi
function updateRegistrationSummary() {
  const regCountEl = document.getElementById('regCount');
  const regCreditsEl = document.getElementById('regCredits');
  const fcCountEl = document.getElementById('fcCount');
  const fcCreditsEl = document.getElementById('fcCredits');
  const fcStatusEl = document.getElementById('fcStatus');
  const modalCreditsEl = document.getElementById('modalCredits');
  const selectedModalBody = document.getElementById('selectedModalBody');

  let totalCredits = 0;
  const registeredCourses = [];

  registeredCourseIds.forEach(id => {
    const course = MOCK_DATA.find(c => c.id === id);
    if (course) {
      totalCredits += course.credits;
      registeredCourses.push(course);
    }
  });

  const count = registeredCourseIds.size;

  // Cập nhật thẻ Header
  if (regCountEl) regCountEl.textContent = count;
  if (regCreditsEl) regCreditsEl.textContent = totalCredits;

  // Cập nhật Thanh nổi (Sticky bar)
  if (fcCountEl) fcCountEl.textContent = count;
  if (fcCreditsEl) fcCreditsEl.textContent = totalCredits;

  // Cập nhật trạng thái tín chỉ (chuẩn quy định tín chỉ sinh viên)
  if (fcStatusEl) {
    fcStatusEl.className = 'fc-status-pill';
    if (count === 0) {
      fcStatusEl.classList.add('status-neutral');
      fcStatusEl.textContent = 'Chưa chọn môn';
    } else if (totalCredits < 12) {
      fcStatusEl.classList.add('status-warning');
      fcStatusEl.textContent = `Thiếu TC (Tối thiểu 12 TC)`;
    } else if (totalCredits <= 24) {
      fcStatusEl.classList.add('status-valid');
      fcStatusEl.textContent = `Hợp lệ (${totalCredits}/24 TC)`;
    } else {
      fcStatusEl.classList.add('status-danger');
      fcStatusEl.textContent = `Vượt tối đa (${totalCredits}/24 TC)`;
    }
  }

  // Cập nhật danh sách trong Modal
  if (modalCreditsEl) modalCreditsEl.textContent = totalCredits;
  if (selectedModalBody) {
    if (registeredCourses.length === 0) {
      selectedModalBody.innerHTML = `
        <div class="modal-empty">
          <i class="fa-solid fa-box-open" style="font-size: 2rem; margin-bottom: 8px; display: block; opacity: 0.5;"></i>
          Bạn chưa chọn môn học nào trong học kỳ này.
        </div>
      `;
    } else {
      selectedModalBody.innerHTML = registeredCourses.map(c => `
        <div class="modal-course-item">
          <div class="mci-info">
            <span class="mci-title">[${c.code}] ${c.name}</span>
            <span class="mci-sub">GV: ${c.teacher} • <b>${c.credits} tín chỉ</b></span>
          </div>
          <button type="button" class="mci-btn-del" onclick="registerCourse(${c.id})" title="Hủy đăng ký môn này">
            <i class="fa-solid fa-trash-can"></i>
            <span>Hủy</span>
          </button>
        </div>
      `).join('');
    }
  }
}

function renderCourses(courses) {
  const container = document.getElementById('courseContainer');
  if (!container) return;

  if (courses.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-folder-open"></i>
        <p>Không tìm thấy môn học nào phù hợp với bộ lọc hiện tại.</p>
      </div>
    `;
    return;
  }
  
  const groupedCourses = courses.reduce((acc, course) => {
    if (!acc[course.major]) acc[course.major] = [];
    acc[course.major].push(course);
    return acc;
  }, {});

  let html = '';
  
  for (const major in groupedCourses) {
    html += `
      <h3 class="major-title">
        <i class="fa-solid fa-layer-group"></i> Ngành ${major}
      </h3>
    `;
    
    html += '<div class="course-grid">';
    html += groupedCourses[major].map(c => {
      const isRegistered = registeredCourseIds.has(c.id);
      const isClassFull = c.enrolled >= c.slots;
      const pct = Math.min(100, Math.round((c.enrolled / c.slots) * 100));
      const badgeClass = c.type === 'Bắt buộc' ? 'badge-bb' : 'badge-tc';
      
      let btnClass = 'btn-available';
      let btnContent = '<i class="fa-solid fa-plus"></i> Đăng ký';
      let btnDisabled = '';

      if (isRegistered) {
        btnClass = 'btn-registered';
        btnContent = `
          <span class="btn-text-default"><i class="fa-solid fa-circle-check"></i> Đã đăng ký</span>
          <span class="btn-text-hover"><i class="fa-solid fa-xmark"></i> Hủy đăng ký</span>
        `;
      } else if (isClassFull) {
        btnClass = 'btn-full';
        btnContent = '<i class="fa-solid fa-lock"></i> Hết chỗ';
        btnDisabled = 'disabled';
      }

      let fillStatusClass = '';
      if (isClassFull) {
        fillStatusClass = 'full';
      } else if (pct >= 85) {
        fillStatusClass = 'high';
      }

      return `
        <div class="course-card ${isRegistered ? 'is-registered' : ''}">
          <span class="course-badge ${badgeClass}">${c.type}</span>
          <h3 class="course-title" title="${c.name}">${c.name}</h3>
          
          <div class="course-info">
            <span><i class="fa-solid fa-barcode"></i> Mã môn: <b>${c.code}</b></span>
            <span><i class="fa-solid fa-chalkboard-user"></i> Giảng viên: ${c.teacher}</span>
            <span><i class="fa-solid fa-coins"></i> Tín chỉ: ${c.credits}</span>
            <span>
              <i class="fa-solid fa-user-group"></i> Sĩ số: <b>${c.enrolled}/${c.slots}</b>
            </span>
            <div class="capacity-wrap">
              <div class="capacity-bar">
                <div class="capacity-fill ${fillStatusClass}" style="width: ${pct}%"></div>
              </div>
            </div>
          </div>

          <button class="btn-act ${btnClass}" ${btnDisabled} onclick="registerCourse(${c.id})">
            ${btnContent}
          </button>
        </div>
      `;
    }).join('');
    html += '</div>';
  }
  
  container.innerHTML = html;
}

function initCoursePage() {
  const searchInput = document.getElementById('searchInput');
  const filterSelect = document.getElementById('filterSelect');
  const majorSelect = document.getElementById('majorSelect');
  
  function filterData() {
    const text = (searchInput ? searchInput.value : '').trim().toLowerCase();
    const type = filterSelect ? filterSelect.value : 'all';
    const major = majorSelect ? majorSelect.value : 'all';
    
    const filtered = MOCK_DATA.filter(c => {
      const matchText = c.name.toLowerCase().includes(text) || c.code.toLowerCase().includes(text);
      const matchType = type === 'all' || c.type === type;
      const matchMajor = major === 'all' || c.major === major;
      return matchText && matchType && matchMajor;
    });
    
    renderCourses(filtered);
    updateRegistrationSummary();
  }

  // Gán ra window để registerCourse gọi lại cập nhật UI
  window.applyCourseFilter = filterData;
  
  if (searchInput) searchInput.addEventListener('input', filterData);
  if (filterSelect) filterSelect.addEventListener('change', filterData);
  if (majorSelect) majorSelect.addEventListener('change', filterData);

  filterData();
}

document.addEventListener('DOMContentLoaded', initCoursePage);