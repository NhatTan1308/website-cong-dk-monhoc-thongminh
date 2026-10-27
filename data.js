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

const CREDIT_PRICE = 500000;
const BASE_FEE = 150000;
const formatCoursePrice = (amount) => `${Number(amount).toLocaleString('vi-VN')} ₫`;
const DEMO_CLASS_OPTIONS = new Map(MOCK_DATA.map((course, index) => {
  const duration = course.credits >= 4 ? 3 : 2;
  const group = Math.floor(index / 6);
  const firstStart = 1 + ((group * 3 + index) % 8);
  const secondStart = 1 + ((index * 3 + group) % 8);
  const firstDay = index % 6;
  const secondDay = (firstDay + 2 + group % 3) % 6;
  return [course.id, [
    { section: 'A', day: firstDay, start: firstStart, end: firstStart + duration - 1, room: `A${201 + course.id}` },
    { section: 'B', day: secondDay, start: secondStart, end: secondStart + duration - 1, room: `B${101 + course.id}` }
  ]];
}));

const courseUser = (() => {
  try {
    return JSON.parse(sessionStorage.getItem('sc_user') || 'null');
  } catch {
    return null;
  }
})();
const studentDataKeys = [
  'sc_registered',
  'sc_registered_courses',
  'sc_confirmed_courses',
  'sc_paid',
  'sc_schedule_plan',
  'sc_schedule_mode'
];
const studentStoragePrefix = courseUser && typeof courseUser.mssv === 'string'
  ? `sc_student_${encodeURIComponent(courseUser.mssv.trim().toLowerCase())}_`
  : null;

function getStudentStorageKey(key) {
  if (!studentStoragePrefix || !studentDataKeys.includes(key)) {
    throw new Error(`Không thể truy cập dữ liệu sinh viên "${key}" khi chưa có phiên đăng nhập hợp lệ.`);
  }
  return `${studentStoragePrefix}${key}`;
}

function getStudentStorageItem(key) {
  return localStorage.getItem(getStudentStorageKey(key));
}

function setStudentStorageItem(key, value) {
  localStorage.setItem(getStudentStorageKey(key), value);
}

function removeStudentStorageItem(key) {
  localStorage.removeItem(getStudentStorageKey(key));
}

if (studentStoragePrefix) {
  try {
    const migrationMarker = 'sc_student_data_migrated_v1';
    if (localStorage.getItem(migrationMarker) === null) {
      const legacyValues = new Map(studentDataKeys
        .map(key => [key, localStorage.getItem(key)])
        .filter(([, value]) => value !== null));
      legacyValues.forEach((value, key) => {
        if (getStudentStorageItem(key) === null) setStudentStorageItem(key, value);
      });
      localStorage.setItem(migrationMarker, courseUser.mssv.trim().toLowerCase());
      legacyValues.forEach((_, key) => localStorage.removeItem(key));
    }
  } catch (error) {
    console.error('Không thể tách dữ liệu đăng ký cũ theo tài khoản.', error);
  }
}

const readCourseRegistrations = () => {
  if (!studentStoragePrefix) return [];
  try {
    const saved = getStudentStorageItem('sc_registered');
    if (saved !== null) {
      const registrations = JSON.parse(saved);
      if (!Array.isArray(registrations)) throw new Error('Danh sách môn đăng ký không hợp lệ.');
      return registrations
        .map(registration => Number(typeof registration === 'object' ? registration.courseId : registration))
        .filter(Number.isFinite);
    }
    const legacyIds = JSON.parse(getStudentStorageItem('sc_registered_courses') || '[]');
    if (!Array.isArray(legacyIds)) throw new Error('Danh sách môn đăng ký cũ không hợp lệ.');
    return legacyIds.map(Number).filter(Number.isFinite);
  } catch (error) {
    console.error('Không thể đọc danh sách môn đã đăng ký:', error);
    return [];
  }
};
const registeredCourseIds = new Set(readCourseRegistrations());

registeredCourseIds.forEach(id => {
  const course = MOCK_DATA.find(item => item.id === id);
  if (course && course.enrolled < course.slots) course.enrolled += 1;
});

function saveRegisteredState() {
  let previousRegistrations;
  let previousConfirmations;
  try {
    previousRegistrations = getStudentStorageItem('sc_registered');
    previousConfirmations = getStudentStorageItem('sc_confirmed_courses');
    const confirmedIds = JSON.parse(previousConfirmations || '[]');
    if (!Array.isArray(confirmedIds)) throw new Error('Danh sách môn đã xác nhận không hợp lệ.');
    setStudentStorageItem('sc_registered', JSON.stringify(
      [...registeredCourseIds].map(courseId => ({ courseId, classId: null }))
    ));
    setStudentStorageItem('sc_confirmed_courses', JSON.stringify(
      confirmedIds.map(Number).filter(courseId => registeredCourseIds.has(courseId))
    ));
    removeStudentStorageItem('sc_paid');
    return true;
  } catch (error) {
    console.error('Không thể lưu trạng thái đăng ký:', error);
    try {
      if (previousRegistrations === null) removeStudentStorageItem('sc_registered');
      else if (previousRegistrations !== undefined) setStudentStorageItem('sc_registered', previousRegistrations);
      if (previousConfirmations === null) removeStudentStorageItem('sc_confirmed_courses');
      else if (previousConfirmations !== undefined) setStudentStorageItem('sc_confirmed_courses', previousConfirmations);
    } catch (rollbackError) {
      console.error('Không thể khôi phục dữ liệu đăng ký sau lỗi lưu.', rollbackError);
    }
    return false;
  }
}

function getRegisteredCourses() {
  return MOCK_DATA.filter(course => registeredCourseIds.has(course.id));
}

function getConfirmedCourseIds() {
  if (!studentStoragePrefix) return new Set();
  try {
    const savedIds = JSON.parse(getStudentStorageItem('sc_confirmed_courses') || '[]');
    if (!Array.isArray(savedIds)) throw new Error('Danh sách môn đã xác nhận không hợp lệ.');
    return new Set(savedIds.map(Number).filter(Number.isFinite));
  } catch (error) {
    console.error('Không thể đọc danh sách môn đã xác nhận:', error);
    return null;
  }
}

function getConfirmedCourses() {
  const confirmedIds = getConfirmedCourseIds();
  return confirmedIds
    ? getRegisteredCourses().filter(course => confirmedIds.has(course.id))
    : [];
}

function confirmRegisteredCourses(courseIds) {
  if (!Array.isArray(courseIds)) return false;

  const selectedIds = new Set(courseIds.map(Number).filter(Number.isFinite));
  const registeredIds = new Set(getRegisteredCourses().map(course => course.id));
  const validSelectedIds = [...selectedIds].filter(courseId => registeredIds.has(courseId));
  if (!validSelectedIds.length) return false;

  try {
    const existingIds = JSON.parse(getStudentStorageItem('sc_confirmed_courses') || '[]');
    if (!Array.isArray(existingIds)) throw new Error('Danh sách môn đã xác nhận không hợp lệ.');
    const confirmedIds = new Set(existingIds.map(Number).filter(courseId => registeredIds.has(courseId)));
    validSelectedIds.forEach(courseId => confirmedIds.add(courseId));
    setStudentStorageItem('sc_confirmed_courses', JSON.stringify([...confirmedIds]));
    return true;
  } catch (error) {
    console.error('Không thể xác nhận môn học:', error);
    return false;
  }
}

function getCourseSchedule(course) {
  const index = MOCK_DATA.findIndex(item => item.id === course.id);
  const start = (index % 4) * 3 + 1;
  return {
    day: Math.floor(index / 4) % 6,
    start,
    end: start + (course.credits >= 4 ? 2 : 1),
    room: `Phòng ${String.fromCharCode(65 + (index % 5))}${101 + (index % 12)}`,
    color: ['#0d9488', '#0ea5e9', '#8b5cf6', '#f59e0b', '#ef6472'][index % 5]
  };
}

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

  if (!courseUser) {
    window.location.href = '../Login_Register/login.html?registrationRequired=1';
    return;
  }

  if (courseUser && course.major !== courseUser.major) {
    showToast('Bạn chỉ có thể đăng ký môn học thuộc ngành của mình.', 'error');
    return;
  }

  // Trường hợp 1: Môn này ĐÃ ĐƯỢC sinh viên đăng ký trước đó -> Nhấn vào sẽ HỦY ĐĂNG KÝ
  if (registeredCourseIds.has(courseId)) {
    const confirmedIds = getConfirmedCourseIds();
    if (!confirmedIds) {
      showToast('Không thể kiểm tra trạng thái xác nhận. Vui lòng tải lại trang trước khi thay đổi đăng ký.', 'error');
      return;
    }
    if (confirmedIds.has(courseId)) {
      showToast('Môn học đã được xác nhận ở trang Học phí và không thể hủy đăng ký.', 'error');
      return;
    }

    registeredCourseIds.delete(courseId);
    course.enrolled = Math.max(0, course.enrolled - 1);
    if (!saveRegisteredState()) {
      registeredCourseIds.add(courseId);
      course.enrolled += 1;
      showToast('Không thể lưu thay đổi. Vui lòng kiểm tra bộ nhớ trình duyệt.', 'error');
      return;
    }
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
  if (!saveRegisteredState()) {
    registeredCourseIds.delete(courseId);
    course.enrolled -= 1;
    showToast('Không thể lưu thay đổi. Vui lòng kiểm tra bộ nhớ trình duyệt.', 'error');
    return;
  }
  showToast(`Đăng ký thành công môn: [${course.code}] ${course.name}`, 'success');

  // Cập nhật lại giao diện ngay lập tức
  if (typeof window.applyCourseFilter === 'function') {
    window.applyCourseFilter();
  }
}

// Đóng/Mở popup xem danh sách môn đã chọn
function toggleSelectedModal() {
  const modal = document.getElementById('selectedModal');
  const card = modal && modal.querySelector('.modal-card');
  if (!modal || !card) return;

  if (modal.classList.contains('hidden')) {
    if (card._closeAnimationHandler) {
      card.removeEventListener('animationend', card._closeAnimationHandler);
      card._closeAnimationHandler = null;
    }
    modal.classList.remove('hidden');
    card.classList.remove('animate__zoomOut');
    card.classList.add('animate__zoomIn');
    return;
  }

  card.classList.remove('animate__zoomIn');
  card.classList.add('animate__zoomOut');
  const closeAfterAnimation = (event) => {
    if (event && event.target !== card) return;
    if (modal.classList.contains('hidden') || !card.classList.contains('animate__zoomOut')) return;
    modal.classList.add('hidden');
    card.classList.remove('animate__zoomOut');
    card.removeEventListener('animationend', closeAfterAnimation);
    card._closeAnimationHandler = null;
  };
  card._closeAnimationHandler = closeAfterAnimation;
  card.addEventListener('animationend', closeAfterAnimation);
  window.setTimeout(() => closeAfterAnimation(null), 600);
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
  let totalFee = 0;
  const registeredCourses = [];

  registeredCourseIds.forEach(id => {
    const course = MOCK_DATA.find(c => c.id === id);
    if (course) {
      totalCredits += course.credits;
      totalFee += course.credits * CREDIT_PRICE;
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
  const modalTotalFeeEl = document.getElementById('modalTotalFee');
  if (modalTotalFeeEl) modalTotalFeeEl.textContent = formatCoursePrice(totalFee);
  if (selectedModalBody) {
    const confirmedIds = getConfirmedCourseIds();
    if (registeredCourses.length === 0) {
      selectedModalBody.innerHTML = `
        <div class="modal-empty">
          <i class="fa-solid fa-box-open" style="font-size: 2rem; margin-bottom: 8px; display: block; opacity: 0.5;"></i>
          Bạn chưa chọn môn học nào trong học kỳ này.
        </div>
      `;
    } else {
      selectedModalBody.innerHTML = registeredCourses.map(c => {
        const isLocked = !confirmedIds || confirmedIds.has(c.id);
        return `
          <div class="modal-course-item">
            <div class="mci-info">
              <span class="mci-title">[${c.code}] ${c.name}</span>
              <span class="mci-sub">GV: ${c.teacher} • <b>${c.credits} tín chỉ</b> • ${formatCoursePrice(c.credits * CREDIT_PRICE)}</span>
            </div>
            <button type="button" class="mci-btn-del${isLocked ? ' mci-btn-locked' : ''}" onclick="registerCourse(${c.id})"${isLocked ? ' disabled title="Môn đã xác nhận hoặc không thể kiểm tra trạng thái xác nhận"' : ' title="Hủy đăng ký môn này"'}>
              <i class="fa-solid ${isLocked ? 'fa-lock' : 'fa-trash-can'}"></i>
              <span>${isLocked ? 'Đã xác nhận' : 'Hủy'}</span>
            </button>
          </div>
        `;
      }).join('');
    }
  }
}

function renderCourses(courses) {
  const container = document.getElementById('courseContainer');
  if (!container) return;
  const shouldAnimate = !container.dataset.hasRendered;

  if (courses.length === 0) {
    container.innerHTML = `
      <div class="empty-state animate__animated animate__fadeIn animate__faster">
        <i class="fa-solid fa-folder-open"></i>
        <p>Không tìm thấy môn học nào phù hợp với bộ lọc hiện tại.</p>
      </div>
    `;
    container.dataset.hasRendered = 'true';
    return;
  }

  const confirmedIds = getConfirmedCourseIds();
  const groupedCourses = courses.reduce((acc, course) => {
    if (!acc[course.major]) acc[course.major] = [];
    acc[course.major].push(course);
    return acc;
  }, {});

  let html = '';

  for (const major in groupedCourses) {
    html += `
      <h3 class="major-title${shouldAnimate ? ' animate__animated animate__slideInLeft animate__faster' : ''}">
        <i class="fa-solid fa-layer-group"></i> Ngành ${major}
      </h3>
    `;

    html += '<div class="course-grid">';
    html += groupedCourses[major].map(c => {
      const isRegistered = registeredCourseIds.has(c.id);
      const isConfirmed = isRegistered && (!confirmedIds || confirmedIds.has(c.id));
      const isClassFull = c.enrolled >= c.slots;
      const pct = Math.min(100, Math.round((c.enrolled / c.slots) * 100));
      const badgeClass = c.type === 'Bắt buộc' ? 'badge-bb' : 'badge-tc';

      let btnClass = 'btn-available';
      let btnContent = '<i class="fa-solid fa-plus"></i> Đăng ký';
      let btnDisabled = '';

      if (isConfirmed) {
        btnClass = 'btn-confirmed';
        btnContent = '<i class="fa-solid fa-lock"></i> Đã xác nhận · Không thể hủy';
        btnDisabled = 'disabled title="Môn đã xác nhận ở trang Học phí nên không thể hủy đăng ký"';
      } else if (isRegistered) {
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
        <div class="course-card${isRegistered ? ' is-registered' : ''}${shouldAnimate ? ' animate__animated animate__fadeInUp animate__faster' : ''}">
          <span class="course-badge ${badgeClass}">${c.type}</span>
          <h3 class="course-title" title="${c.name}">${c.name}</h3>
          
          <div class="course-info">
            <span><i class="fa-solid fa-barcode"></i> Mã môn: <b>${c.code}</b></span>
            <span><i class="fa-solid fa-chalkboard-user"></i> Giảng viên: ${c.teacher}</span>
            <span><i class="fa-solid fa-coins"></i> Tín chỉ: ${c.credits}</span>
            <span><i class="fa-solid fa-money-bill-wave"></i> Học phí: <b>${formatCoursePrice(c.credits * CREDIT_PRICE)}</b></span>
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
  container.dataset.hasRendered = 'true';
  window.initUIEffects?.();
}

function initCoursePage() {
  const searchInput = document.getElementById('searchInput');
  const filterSelect = document.getElementById('filterSelect');
  const majorSelect = document.getElementById('majorSelect');
  const majorLock = document.getElementById('major-lock');

  if (courseUser && courseUser.major && majorSelect) {
    majorSelect.value = courseUser.major;
    majorSelect.disabled = true;
    if (majorLock) majorLock.classList.remove('hidden');
  }

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
  window.addEventListener('storage', event => {
    if (event.key === getStudentStorageKey('sc_confirmed_courses') || event.key === null) {
      filterData();
    }
  });

  if (searchInput) searchInput.addEventListener('input', filterData);
  if (filterSelect) filterSelect.addEventListener('change', filterData);
  if (majorSelect) majorSelect.addEventListener('change', filterData);

  filterData();
}

document.addEventListener('DOMContentLoaded', initCoursePage);