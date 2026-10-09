/* =============================================
   SMARTCOURSE – script.js
   JavaScript: Mock data + tất cả chức năng 5 trang
   ============================================= */

/* =========================================
   MOCK DATA
   ========================================= */
const MOCK_USERS = [
  { mssv: '22110001', password: '123456', name: 'Trần Văn Khoa', major: 'CNTT', majorName: 'Công nghệ thông tin', year: 3, email: '22110001@lachong.edu.vn', totalCredits: 72 },
  { mssv: '22110002', password: '123456', name: 'Nguyễn Văn An', major: 'KTPM', majorName: 'Kỹ thuật phần mềm', year: 2, email: '22110002@lachong.edu.vn', totalCredits: 45 },
  { mssv: 'admin', password: 'admin', name: 'Quản trị viên', major: 'CNTT', majorName: 'Công nghệ thông tin', year: 4, email: 'admin@lachong.edu.vn', totalCredits: 120 },
];

const COURSE_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#84cc16'];

const MOCK_COURSES = [
  {
    id: 'CSC301', code: 'CSC301', name: 'Lập trình Web', credits: 3, type: 'Bắt buộc',
    description: 'HTML, CSS, JavaScript, frameworks hiện đại', prerequisite: 'CSC201',
    classes: [
      { id: 'LT01', teacher: 'Nguyễn Minh Nhựt', day: 'Thứ 2', periods: [1,2,3], room: 'B4.01', enrolled: 45, max: 50 },
      { id: 'LT02', teacher: 'Trần Thị Lan', day: 'Thứ 4', periods: [4,5,6], room: 'B4.03', enrolled: 50, max: 50 },
      { id: 'LT03', teacher: 'Lê Văn Hùng', day: 'Thứ 6', periods: [1,2,3], room: 'B2.05', enrolled: 30, max: 50 },
    ],
    color: '#3b82f6'
  },
  {
    id: 'CSC302', code: 'CSC302', name: 'Cơ sở dữ liệu nâng cao', credits: 3, type: 'Bắt buộc',
    description: 'SQL, NoSQL, tối ưu hóa truy vấn, thiết kế CSDL', prerequisite: 'CSC202',
    classes: [
      { id: 'DB01', teacher: 'Phạm Thị Hoa', day: 'Thứ 3', periods: [1,2,3], room: 'C1.08', enrolled: 40, max: 45 },
      { id: 'DB02', teacher: 'Nguyễn Văn Dũng', day: 'Thứ 5', periods: [4,5,6], room: 'C1.10', enrolled: 35, max: 45 },
    ],
    color: '#8b5cf6'
  },
  {
    id: 'CSC303', code: 'CSC303', name: 'Mạng máy tính', credits: 3, type: 'Bắt buộc',
    description: 'Giao thức TCP/IP, mô hình OSI, bảo mật mạng', prerequisite: '',
    classes: [
      { id: 'NET01', teacher: 'Vũ Trọng Hiếu', day: 'Thứ 2', periods: [7,8,9], room: 'A3.02', enrolled: 48, max: 50 },
      { id: 'NET02', teacher: 'Bùi Thị Mai', day: 'Thứ 4', periods: [1,2,3], room: 'A3.05', enrolled: 20, max: 50 },
    ],
    color: '#10b981'
  },
  {
    id: 'MTH201', code: 'MTH201', name: 'Toán rời rạc', credits: 3, type: 'Bắt buộc',
    description: 'Lý thuyết tập hợp, đồ thị, tổ hợp, logic mệnh đề', prerequisite: '',
    classes: [
      { id: 'MTH01', teacher: 'Hoàng Văn Khải', day: 'Thứ 3', periods: [7,8,9], room: 'D1.04', enrolled: 55, max: 60 },
      { id: 'MTH02', teacher: 'Nguyễn Thị Bình', day: 'Thứ 5', periods: [1,2,3], room: 'D1.06', enrolled: 40, max: 60 },
    ],
    color: '#f59e0b'
  },
  {
    id: 'CSC304', code: 'CSC304', name: 'Kiến trúc máy tính', credits: 3, type: 'Bắt buộc',
    description: 'CPU, bộ nhớ, pipeline, hợp ngữ Assembly', prerequisite: '',
    classes: [
      { id: 'ARC01', teacher: 'Đỗ Minh Châu', day: 'Thứ 6', periods: [4,5,6], room: 'B1.09', enrolled: 50, max: 50 },
      { id: 'ARC02', teacher: 'Phạm Cường Thịnh', day: 'Thứ 2', periods: [4,5,6], room: 'B1.11', enrolled: 30, max: 50 },
    ],
    color: '#ef4444'
  },
  {
    id: 'CSC305', code: 'CSC305', name: 'Trí tuệ nhân tạo', credits: 3, type: 'Tự chọn',
    description: 'Machine learning, AI cơ bản, tìm kiếm heuristic', prerequisite: 'MTH201',
    classes: [
      { id: 'AI01', teacher: 'Lê Thị Thanh', day: 'Thứ 4', periods: [7,8,9], room: 'B4.12', enrolled: 38, max: 40 },
    ],
    color: '#ec4899'
  },
  {
    id: 'CSC306', code: 'CSC306', name: 'Phát triển ứng dụng di động', credits: 3, type: 'Tự chọn',
    description: 'React Native / Flutter – phát triển app đa nền tảng', prerequisite: 'CSC301',
    classes: [
      { id: 'MB01', teacher: 'Phạm Vũ Tuyền', day: 'Thứ 3', periods: [4,5,6], room: 'C2.07', enrolled: 25, max: 40 },
      { id: 'MB02', teacher: 'Nguyễn Vũ Tân', day: 'Thứ 5', periods: [7,8,9], room: 'C2.09', enrolled: 10, max: 40 },
    ],
    color: '#06b6d4'
  },
  {
    id: 'CSC307', code: 'CSC307', name: 'An toàn thông tin', credits: 3, type: 'Tự chọn',
    description: 'Mã hóa, bảo mật ứng dụng, an toàn mạng', prerequisite: 'CSC303',
    classes: [
      { id: 'SEC01', teacher: 'Trần Đức Minh', day: 'Thứ 6', periods: [7,8,9], room: 'A4.02', enrolled: 20, max: 35 },
    ],
    color: '#84cc16'
  },
  {
    id: 'INT301', code: 'INT301', name: 'Thực tập dự án', credits: 2, type: 'Bắt buộc',
    description: 'Thực hành dự án nhóm theo định hướng thực tế doanh nghiệp', prerequisite: '',
    classes: [
      { id: 'INT01', teacher: 'Nhiều giảng viên', day: 'Thứ 6', periods: [1,2], room: 'Nhiều phòng', enrolled: 80, max: 100 },
    ],
    color: '#f97316'
  },
  {
    id: 'CSC308', code: 'CSC308', name: 'Nhập môn Machine Learning', credits: 3, type: 'Tự chọn',
    description: 'Supervised/Unsupervised learning, Neural Networks cơ bản', prerequisite: 'MTH201',
    classes: [
      { id: 'ML01', teacher: 'Võ Thị Hằng', day: 'Thứ 2', periods: [10,11,12], room: 'D3.01', enrolled: 30, max: 45 },
      { id: 'ML02', teacher: 'Lương Văn Phúc', day: 'Thứ 4', periods: [10,11,12], room: 'D3.03', enrolled: 20, max: 45 },
    ],
    color: '#a855f7'
  },
];

const PERIOD_TIMES = [
  { period: 1, start: '07:00', end: '07:50' },
  { period: 2, start: '08:00', end: '08:50' },
  { period: 3, start: '09:00', end: '09:50' },
  { period: 4, start: '10:00', end: '10:50' },
  { period: 5, start: '11:00', end: '11:50' },
  { period: 6, start: '12:00', end: '12:50' },
  { period: 7, start: '13:00', end: '13:50' },
  { period: 8, start: '14:00', end: '14:50' },
  { period: 9, start: '15:00', end: '15:50' },
  { period: 10, start: '16:00', end: '16:50' },
  { period: 11, start: '17:00', end: '17:50' },
  { period: 12, start: '18:00', end: '18:50' },
];

const DAY_LABELS = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
const CREDIT_PRICE = 500000; // VND per credit

/* =========================================
   STATE HELPERS & PERSISTENCE
   ========================================= */
const getUser = () => JSON.parse(sessionStorage.getItem('sc_user') || 'null');
const setUser = (u) => sessionStorage.setItem('sc_user', JSON.stringify(u));

const getCart = () => JSON.parse(localStorage.getItem('sc_cart') || '[]');
const setCart = (c) => localStorage.setItem('sc_cart', JSON.stringify(c));

const getRegistered = () => JSON.parse(localStorage.getItem('sc_registered') || '[]');
const setRegistered = (r) => localStorage.setItem('sc_registered', JSON.stringify(r));

/* Get all users from localStorage (seeds with MOCK_USERS initially) */
function getAllUsers() {
  const raw = localStorage.getItem('sc_users');
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {}
  }
  localStorage.setItem('sc_users', JSON.stringify(MOCK_USERS));
  return [...MOCK_USERS];
}

function saveAllUsers(users) {
  localStorage.setItem('sc_users', JSON.stringify(users));
}

/* Notifications Mock Data & Helpers */
const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: 'Hạn đăng ký môn học: 15/10/2026',
    desc: 'Hệ thống đăng ký môn HK1 sẽ đóng vào 23:59 ngày 15/10. Vui lòng hoàn tất đăng ký.',
    time: '10 phút trước',
    type: 'urgent',
    icon: 'fa-triangle-exclamation',
    unread: true,
    link: 'courses.html'
  },
  {
    id: 2,
    title: 'Nhắc nhở học phí HK1 – 2025/2026',
    desc: 'Hạn nộp học phí trước ngày 15/10/2026. Kiểm tra chi tiết trong mục Học phí.',
    time: '2 giờ trước',
    type: 'warning',
    icon: 'fa-receipt',
    unread: true,
    link: 'tuition.html'
  },
  {
    id: 3,
    title: 'Lịch thi giữa kỳ đã cập nhật',
    desc: 'Đã có lịch thi các môn chuyên ngành trên cổng thời khóa biểu.',
    time: '1 ngày trước',
    type: 'info',
    icon: 'fa-calendar-days',
    unread: true,
    link: 'schedule.html'
  },
  {
    id: 4,
    title: 'Học bổng khuyến học đợt 2 mở nộp đơn',
    desc: 'Sinh viên có GPA ≥ 3.2 có thể nộp hồ sơ xét học bổng khuyến học.',
    time: '2 ngày trước',
    type: 'success',
    icon: 'fa-award',
    unread: true,
    link: 'home.html'
  }
];

function getNotifications() {
  const raw = localStorage.getItem('sc_notifications');
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {}
  }
  localStorage.setItem('sc_notifications', JSON.stringify(MOCK_NOTIFICATIONS));
  return [...MOCK_NOTIFICATIONS];
}

function saveNotifications(notifs) {
  localStorage.setItem('sc_notifications', JSON.stringify(notifs));
}

function initNotifications() {
  const notifBtn = document.getElementById('notif-btn');
  const notifDropdown = document.getElementById('notif-dropdown');
  const notifList = document.getElementById('notif-dropdown-list');
  const notifDot = document.getElementById('notif-dot');
  const countBadge = document.getElementById('notif-count-badge');
  const markReadBtn = document.getElementById('notif-mark-read');

  if (!notifBtn || !notifDropdown) return;

  function renderNotifs() {
    const notifs = getNotifications();
    const unreadCount = notifs.filter(n => n.unread).length;

    if (notifDot) {
      if (unreadCount > 0) {
        notifDot.classList.remove('hidden');
      } else {
        notifDot.classList.add('hidden');
      }
    }
    if (countBadge) {
      countBadge.textContent = unreadCount;
      countBadge.style.display = unreadCount > 0 ? 'inline-block' : 'none';
    }

    if (!notifList) return;

    if (notifs.length === 0) {
      notifList.innerHTML = `
        <div class="notif-empty">
          <i class="fa-regular fa-bell-slash"></i>
          <p>Không có thông báo nào</p>
        </div>`;
      return;
    }

    notifList.innerHTML = notifs.map(n => `
      <div class="notif-item ${n.unread ? 'unread' : ''}" data-id="${n.id}" data-link="${n.link || ''}">
        <div class="notif-item-icon ${n.type}">
          <i class="fa-solid ${n.icon}"></i>
        </div>
        <div class="notif-item-content">
          <div class="notif-item-title">${n.title}</div>
          <div class="notif-item-desc">${n.desc}</div>
          <div class="notif-item-time"><i class="fa-regular fa-clock"></i> ${n.time}</div>
        </div>
      </div>
    `).join('');

    notifList.querySelectorAll('.notif-item').forEach(item => {
      item.addEventListener('click', () => {
        const id = +item.dataset.id;
        const link = item.dataset.link;
        markAsRead(id);
        if (link) {
          window.location.href = link;
        }
      });
    });
  }

  function markAsRead(id) {
    const notifs = getNotifications();
    const item = notifs.find(n => n.id === id);
    if (item && item.unread) {
      item.unread = false;
      saveNotifications(notifs);
      renderNotifs();
    }
  }

  function markAllRead() {
    const notifs = getNotifications();
    notifs.forEach(n => n.unread = false);
    saveNotifications(notifs);
    renderNotifs();
    showToast('✅ Đã đánh dấu tất cả thông báo là đã đọc!');
  }

  notifBtn.onclick = (e) => {
    e.stopPropagation();
    notifDropdown.classList.toggle('hidden');
  };

  notifDropdown.onclick = (e) => {
    e.stopPropagation();
  };

  if (markReadBtn) {
    markReadBtn.onclick = (e) => {
      e.stopPropagation();
      markAllRead();
    };
  }

  document.addEventListener('click', (e) => {
    if (!notifDropdown.classList.contains('hidden') && !notifBtn.contains(e.target) && !notifDropdown.contains(e.target)) {
      notifDropdown.classList.add('hidden');
    }
  });

  renderNotifs();
}

/* Require login on app pages */
function requireLogin() {
  if (!getUser()) {
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

/* Populate sidebar user info */
function initSidebarUser() {
  const user = getUser();
  if (!user) return;
  const el = (id) => document.getElementById(id);
  if (el('sidebar-name')) el('sidebar-name').textContent = user.name;
  if (el('sidebar-mssv')) el('sidebar-mssv').textContent = user.mssv;
  if (el('sidebar-avatar')) {
    const parts = user.name.trim().split(' ');
    const initials = parts.length >= 2
      ? parts[0][0] + parts[parts.length - 1][0]
      : user.name.slice(0, 2);
    el('sidebar-avatar').textContent = initials.toUpperCase();
  }

  // Initialize notifications on every authenticated page
  initNotifications();
}

/* Sidebar toggle for mobile */
function initSidebarToggle() {
  const btn = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  if (btn && sidebar) {
    btn.addEventListener('click', () => sidebar.classList.toggle('open'));
    document.addEventListener('click', (e) => {
      if (!sidebar.contains(e.target) && e.target !== btn) {
        sidebar.classList.remove('open');
      }
    });
  }
}

/* Logout */
function initLogout() {
  const btn = document.getElementById('btn-logout');
  if (btn) {
    btn.addEventListener('click', () => {
      sessionStorage.clear();
      localStorage.removeItem('sc_cart');
      localStorage.removeItem('sc_registered');
      window.location.href = 'index.html';
    });
  }
}

/* Show toast notification */
function showToast(msg, duration = 2800) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');
  if (!toast) return;
  toastMsg.textContent = msg;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), duration);
}

/* =========================================
   PAGE: LOGIN (index.html)
   ========================================= */
function initLoginPage() {
  const form = document.getElementById('login-form');
  if (!form) return;

  /* Redirect if already logged in */
  if (getUser()) { window.location.href = 'home.html'; return; }

  /* Ensure users database is seeded in localStorage */
  getAllUsers();

  /* Toggle password visibility */
  const toggleBtn = document.getElementById('toggle-pw');
  const pwInput = document.getElementById('password');
  if (toggleBtn && pwInput) {
    toggleBtn.addEventListener('click', () => {
      const isText = pwInput.type === 'text';
      pwInput.type = isText ? 'password' : 'text';
      toggleBtn.innerHTML = isText
        ? '<i class="fa-solid fa-eye"></i>'
        : '<i class="fa-solid fa-eye-slash"></i>';
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const mssv = document.getElementById('username').value.trim();
    const pw = document.getElementById('password').value;
    const error = document.getElementById('login-error');

    const users = getAllUsers();
    const user = users.find(u => u.mssv.toLowerCase() === mssv.toLowerCase() && u.password === pw);
    if (user) {
      setUser(user);
      window.location.href = 'home.html';
    } else {
      error.classList.remove('hidden');
      form.classList.add('shake');
      setTimeout(() => form.classList.remove('shake'), 500);
    }
  });
}

/* =========================================
   PAGE: REGISTER (register.html)
   ========================================= */
function initRegisterPage() {
  const form = document.getElementById('register-form');
  if (!form) return;

  /* Password toggle buttons */
  document.querySelectorAll('.toggle-pw-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling;
      const isText = input.type === 'text';
      input.type = isText ? 'password' : 'text';
      btn.innerHTML = isText
        ? '<i class="fa-solid fa-eye"></i>'
        : '<i class="fa-solid fa-eye-slash"></i>';
    });
  });

  /* Password strength meter */
  const pwInput = document.getElementById('r-pw');
  const pwBar = document.getElementById('pw-bar');
  const pwLabel = document.getElementById('pw-strength-label');

  if (pwInput) {
    pwInput.addEventListener('input', () => {
      const val = pwInput.value;
      let strength = 0;
      if (val.length >= 6) strength++;
      if (val.length >= 10) strength++;
      if (/[A-Z]/.test(val)) strength++;
      if (/[0-9]/.test(val)) strength++;
      if (/[^A-Za-z0-9]/.test(val)) strength++;

      const pct = (strength / 5) * 100;
      pwBar.style.width = pct + '%';
      if (strength <= 1) { pwBar.style.background = '#ef4444'; pwLabel.textContent = 'Yếu'; pwLabel.style.color = '#ef4444'; }
      else if (strength <= 3) { pwBar.style.background = '#f59e0b'; pwLabel.textContent = 'Trung bình'; pwLabel.style.color = '#f59e0b'; }
      else { pwBar.style.background = '#10b981'; pwLabel.textContent = 'Mạnh'; pwLabel.style.color = '#10b981'; }
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const errDiv = document.getElementById('reg-error');
    const errMsg = document.getElementById('reg-error-msg');
    const sucDiv = document.getElementById('reg-success');

    const mssv = document.getElementById('r-mssv').value.trim();
    const name = document.getElementById('r-name').value.trim();
    const email = document.getElementById('r-email').value.trim();
    const major = document.getElementById('r-major').value;
    const year = document.getElementById('r-year').value;
    const pw = document.getElementById('r-pw').value;
    const pw2 = document.getElementById('r-pw2').value;

    errDiv.classList.add('hidden');

    const users = getAllUsers();
    if (users.find(u => u.mssv.toLowerCase() === mssv.toLowerCase())) {
      errMsg.textContent = 'Mã số sinh viên này đã tồn tại!';
      errDiv.classList.remove('hidden'); return;
    }
    if (pw !== pw2) {
      errMsg.textContent = 'Mật khẩu xác nhận không khớp!';
      errDiv.classList.remove('hidden'); return;
    }
    if (pw.length < 6) {
      errMsg.textContent = 'Mật khẩu phải có ít nhất 6 ký tự!';
      errDiv.classList.remove('hidden'); return;
    }

    const majorNames = {
      CNTT: 'Công nghệ thông tin', KTPM: 'Kỹ thuật phần mềm',
      KHMT: 'Khoa học máy tính', HTTT: 'Hệ thống thông tin', MMT: 'Mạng máy tính & Truyền thông'
    };
    const newUser = { mssv, password: pw, name, major, majorName: majorNames[major], year: +year, email, totalCredits: 0 };
    users.push(newUser);
    saveAllUsers(users);

    sucDiv.classList.remove('hidden');
    setUser(newUser);
    setTimeout(() => { window.location.href = 'home.html'; }, 1600);
  });
}

/* =========================================
   PAGE: HOME (home.html)
   ========================================= */
function initHomePage() {
  if (!document.getElementById('welcome-name')) return;
  if (!requireLogin()) return;

  initSidebarUser();
  initSidebarToggle();
  initLogout();

  const user = getUser();
  const registered = getRegistered(); // [{courseId, classId}, ...]

  document.getElementById('welcome-name').textContent = `Xin chào, ${user.name.split(' ').pop()}! 👋`;
  document.getElementById('welcome-info').textContent =
    `${user.majorName} · Năm ${user.year} · Học kỳ 1 – 2025/2026`;

  /* Compute registered courses */
  const regCourses = registered.map(r => {
    const course = MOCK_COURSES.find(c => c.id === r.courseId);
    const cls = course?.classes.find(cl => cl.id === r.classId);
    return { course, cls };
  }).filter(r => r.course);

  const totalCreditsThisSem = regCourses.reduce((s, r) => s + r.course.credits, 0);
  const totalCredits = user.totalCredits + totalCreditsThisSem;
  const feeThisSem = totalCreditsThisSem * CREDIT_PRICE;

  /* Update stat cards */
  document.getElementById('stat-registered').textContent = regCourses.length;
  document.getElementById('stat-credits').textContent = totalCreditsThisSem;
  document.getElementById('stat-total-credits').textContent = totalCredits;
  document.getElementById('stat-fee').textContent = feeThisSem.toLocaleString('vi-VN') + ' ₫';

  /* Update sidebar stats */
  if (document.getElementById('sidebar-name'))
    document.getElementById('sidebar-name').textContent = user.name;

  /* Progress ring – assume 130 TC total needed */
  const TOTAL_NEEDED = 130;
  const pct = Math.min(100, Math.round((totalCredits / TOTAL_NEEDED) * 100));
  const circumference = 2 * Math.PI * 50; // r=50
  const ring = document.getElementById('grad-ring');
  if (ring) {
    ring.style.strokeDasharray = circumference;
    ring.style.strokeDashoffset = circumference - (pct / 100) * circumference;
  }
  document.getElementById('ring-pct').textContent = pct + '%';
  document.getElementById('prog-done').textContent = `${totalCredits} / ${TOTAL_NEEDED} TC`;
  document.getElementById('grad-bar').style.width = pct + '%';

  /* Course list on home */
  const courseListEl = document.getElementById('home-course-list');
  if (courseListEl) {
    if (regCourses.length === 0) {
      courseListEl.innerHTML = '<li style="color:var(--secondary);font-size:0.85rem;padding:0.5rem 0">Chưa đăng ký môn nào. <a href="courses.html">Đăng ký ngay →</a></li>';
    } else {
      courseListEl.innerHTML = regCourses.map(r => `
        <li>
          <span>
            <span class="course-dot" style="background:${r.course.color}"></span>
            ${r.course.name}
          </span>
          <span class="course-credits-badge">${r.course.credits} TC</span>
        </li>
      `).join('');
    }
  }
}

/* =========================================
   PAGE: COURSES (courses.html)
   ========================================= */
let allCourses = [...MOCK_COURSES];
let selectedCourseForModal = null;

function initCoursesPage() {
  const grid = document.getElementById('course-grid');
  if (!grid) return;
  if (!requireLogin()) return;

  initSidebarUser();
  initSidebarToggle();
  initLogout();

  renderCourseGrid();
  renderCart();
  updateCreditBar();

  /* Filters */
  document.getElementById('search-course').addEventListener('input', renderCourseGrid);
  document.getElementById('filter-type').addEventListener('change', renderCourseGrid);
  document.getElementById('filter-credits').addEventListener('change', renderCourseGrid);
  document.getElementById('filter-day').addEventListener('change', renderCourseGrid);
  document.getElementById('sort-courses').addEventListener('change', renderCourseGrid);
  document.getElementById('btn-clear-filter').addEventListener('click', clearFilters);

  /* Modal close */
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('class-modal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('class-modal')) closeModal();
  });

  /* Confirm registration */
  document.getElementById('btn-confirm-reg').addEventListener('click', confirmRegistration);
}

function getFilteredCourses() {
  const search = document.getElementById('search-course').value.toLowerCase().trim();
  const type = document.getElementById('filter-type').value;
  const credits = document.getElementById('filter-credits').value;
  const day = document.getElementById('filter-day').value;
  const sort = document.getElementById('sort-courses').value;

  let list = MOCK_COURSES.filter(c => {
    if (search && !c.name.toLowerCase().includes(search) && !c.code.toLowerCase().includes(search)) return false;
    if (type && c.type !== type) return false;
    if (credits && c.credits !== +credits) return false;
    if (day && !c.classes.some(cl => cl.day === day)) return false;
    return true;
  });

  if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
  else if (sort === 'credits-asc') list.sort((a, b) => a.credits - b.credits);
  else if (sort === 'credits-desc') list.sort((a, b) => b.credits - a.credits);
  else if (sort === 'slots') list.sort((a, b) => {
    const slotsA = Math.max(...a.classes.map(cl => cl.max - cl.enrolled));
    const slotsB = Math.max(...b.classes.map(cl => cl.max - cl.enrolled));
    return slotsB - slotsA;
  });

  return list;
}

function renderCourseGrid() {
  const grid = document.getElementById('course-grid');
  const registered = getRegistered();
  const cart = getCart();
  const list = getFilteredCourses();

  document.getElementById('catalog-count').textContent = list.length;

  if (list.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--secondary)">
      <i class="fa-solid fa-magnifying-glass" style="font-size:2rem;margin-bottom:0.75rem;display:block"></i>
      Không tìm thấy môn học phù hợp.
    </div>`;
    return;
  }

  grid.innerHTML = list.map(course => {
    const isReg = registered.some(r => r.courseId === course.id);
    const isCart = cart.some(c => c.courseId === course.id);
    const maxSlots = Math.max(...course.classes.map(cl => cl.max));
    const totalEnrolled = course.classes.reduce((s, cl) => s + cl.enrolled, 0);
    const totalMax = course.classes.reduce((s, cl) => s + cl.max, 0);
    const isFull = course.classes.every(cl => cl.enrolled >= cl.max);
    const slotPct = Math.min(100, Math.round((totalEnrolled / totalMax) * 100));

    return `
    <div class="course-card ${isReg ? 'registered' : ''} ${isFull && !isReg ? 'full' : ''}" data-id="${course.id}">
      <div class="cc-header">
        <span class="cc-code">${course.code}</span>
        <span class="cc-type-badge ${course.type === 'Bắt buộc' ? 'badge-required' : 'badge-elective'}">${course.type}</span>
      </div>
      <div class="cc-name">${course.name}</div>
      <div class="cc-meta">
        <span><i class="fa-solid fa-star-half-stroke"></i> ${course.credits} tín chỉ</span>
        <span><i class="fa-solid fa-clock"></i> ${course.classes.length} lớp mở</span>
        ${course.prerequisite ? `<span><i class="fa-solid fa-link"></i> Tiên quyết: ${course.prerequisite}</span>` : ''}
      </div>
      <div class="cc-slots">
        <div style="display:flex;justify-content:space-between;margin-bottom:3px">
          <span>Sĩ số</span>
          <span>${totalEnrolled}/${totalMax} SV</span>
        </div>
        <div class="cc-slots-bar">
          <div style="width:${slotPct}%;background:${slotPct >= 95 ? 'var(--red)' : slotPct >= 70 ? 'var(--orange)' : 'var(--green)'}"></div>
        </div>
      </div>
      <div class="cc-footer">
        ${isReg
          ? `<button class="btn-unregister" onclick="unregisterCourse('${course.id}')"><i class="fa-solid fa-minus"></i> Hủy đăng ký</button>`
          : isFull
            ? `<button class="btn-full" disabled>Đã hết chỗ</button>`
            : `<button class="btn-register" onclick="openClassModal('${course.id}')"><i class="fa-solid fa-plus"></i> Đăng ký</button>`
        }
      </div>
    </div>`;
  }).join('');
}

function openClassModal(courseId) {
  selectedCourseForModal = MOCK_COURSES.find(c => c.id === courseId);
  if (!selectedCourseForModal) return;

  document.getElementById('modal-course-name').textContent = selectedCourseForModal.name;
  document.getElementById('modal-course-info').textContent =
    `${selectedCourseForModal.code} · ${selectedCourseForModal.credits} tín chỉ · ${selectedCourseForModal.type}`;

  const registered = getRegistered();
  const tbody = document.getElementById('class-table-body');
  tbody.innerHTML = selectedCourseForModal.classes.map(cls => {
    const isFull = cls.enrolled >= cls.max;
    const periodStr = `Tiết ${cls.periods[0]}–${cls.periods[cls.periods.length - 1]}`;
    return `
    <tr>
      <td><strong>${cls.id}</strong></td>
      <td>${cls.teacher}</td>
      <td>${cls.day}</td>
      <td>${periodStr}</td>
      <td>${cls.room}</td>
      <td style="color:${isFull ? 'var(--red)' : 'var(--green)'}"><strong>${cls.enrolled}/${cls.max}</strong></td>
      <td>
        <button class="btn-pick" ${isFull ? 'disabled' : ''} onclick="pickClass('${courseId}', '${cls.id}')">
          ${isFull ? 'Hết chỗ' : 'Chọn lớp'}
        </button>
      </td>
    </tr>`;
  }).join('');

  document.getElementById('class-modal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('class-modal').classList.add('hidden');
  selectedCourseForModal = null;
}

function pickClass(courseId, classId) {
  const registered = getRegistered();
  // Check conflict
  const course = MOCK_COURSES.find(c => c.id === courseId);
  const cls = course.classes.find(cl => cl.id === classId);
  const conflict = checkConflict(cls, registered);
  if (conflict) {
    alert(`❌ Xung đột lịch với môn "${conflict}"!\nVui lòng chọn lớp khác.`);
    return;
  }

  // Check credit limit
  const totalCredits = registered.reduce((s, r) => {
    const c = MOCK_COURSES.find(x => x.id === r.courseId);
    return s + (c ? c.credits : 0);
  }, 0);
  if (totalCredits + course.credits > 21) {
    alert('❌ Vượt quá giới hạn 21 tín chỉ / học kỳ!');
    return;
  }

  // Add to registered
  registered.push({ courseId, classId });
  setRegistered(registered);
  cls.enrolled = Math.min(cls.max, cls.enrolled + 1);

  closeModal();
  renderCourseGrid();
  renderCart();
  updateCreditBar();
  showToast(`✅ Đã đăng ký: ${course.name} – Lớp ${classId}`);
}

function checkConflict(newClass, registered) {
  for (const reg of registered) {
    const course = MOCK_COURSES.find(c => c.id === reg.courseId);
    const cls = course?.classes.find(cl => cl.id === reg.classId);
    if (!cls) continue;
    if (cls.day === newClass.day) {
      const overlap = cls.periods.some(p => newClass.periods.includes(p));
      if (overlap) return course.name;
    }
  }
  return null;
}

function unregisterCourse(courseId) {
  if (!confirm('Bạn có chắc muốn hủy đăng ký môn này?')) return;
  const registered = getRegistered().filter(r => r.courseId !== courseId);
  setRegistered(registered);
  renderCourseGrid();
  renderCart();
  updateCreditBar();
  const course = MOCK_COURSES.find(c => c.id === courseId);
  showToast(`🗑️ Đã hủy đăng ký: ${course?.name}`);
}

function renderCart() {
  const registered = getRegistered();
  const cartList = document.getElementById('cart-list');
  const cartCount = document.getElementById('cart-count');
  if (!cartList) return;

  cartCount.textContent = `(${registered.length})`;

  if (registered.length === 0) {
    cartList.innerHTML = '<li class="cart-empty">Chưa chọn môn nào</li>';
    return;
  }

  cartList.innerHTML = registered.map(r => {
    const course = MOCK_COURSES.find(c => c.id === r.courseId);
    return `<li class="cart-item">
      <span>${course?.name || r.courseId}</span>
      <button onclick="unregisterCourse('${r.courseId}')"><i class="fa-solid fa-xmark"></i></button>
    </li>`;
  }).join('');
}

function updateCreditBar() {
  const registered = getRegistered();
  const total = registered.reduce((s, r) => {
    const c = MOCK_COURSES.find(x => x.id === r.courseId);
    return s + (c ? c.credits : 0);
  }, 0);
  const el = document.getElementById('cr-registered');
  const bar = document.getElementById('cr-bar');
  const confirmBtn = document.getElementById('btn-confirm-reg');
  if (el) el.textContent = total;
  if (bar) bar.style.width = Math.min(100, (total / 21) * 100) + '%';
  if (confirmBtn) confirmBtn.disabled = registered.length === 0;
}

function clearFilters() {
  document.getElementById('search-course').value = '';
  document.getElementById('filter-type').value = '';
  document.getElementById('filter-credits').value = '';
  document.getElementById('filter-day').value = '';
  document.getElementById('sort-courses').value = 'name';
  renderCourseGrid();
}

function confirmRegistration() {
  const registered = getRegistered();
  if (registered.length === 0) return;
  const total = registered.reduce((s, r) => {
    const c = MOCK_COURSES.find(x => x.id === r.courseId);
    return s + (c ? c.credits : 0);
  }, 0);
  const fee = (total * CREDIT_PRICE).toLocaleString('vi-VN');
  alert(`✅ Đăng ký thành công!\n📚 ${registered.length} môn học · ${total} tín chỉ\n💰 Học phí dự kiến: ${fee} ₫\n\nVui lòng kiểm tra thời khóa biểu.`);
}

/* =========================================
   PAGE: SCHEDULE (schedule.html)
   ========================================= */
function initSchedulePage() {
  const grid = document.getElementById('schedule-grid');
  if (!grid) return;
  if (!requireLogin()) return;

  initSidebarUser();
  initSidebarToggle();
  initLogout();

  /* Period reference table */
  const periodBody = document.getElementById('period-ref-body');
  if (periodBody) {
    periodBody.innerHTML = PERIOD_TIMES.map(p =>
      `<tr><td><strong>Tiết ${p.period}</strong></td><td>${p.start}</td><td>${p.end}</td></tr>`
    ).join('');
  }

  renderScheduleGrid();
  initWeekNav();
}

let currentWeek = 0; // relative week index
const WEEK_START_DATE = new Date(2026, 9, 6); // Oct 6 2026

function getWeekDates(weekOffset) {
  const dates = [];
  for (let i = 0; i < 6; i++) {
    const d = new Date(WEEK_START_DATE);
    d.setDate(d.getDate() + weekOffset * 7 + i);
    dates.push(d);
  }
  return dates;
}

function initWeekNav() {
  const label = document.getElementById('week-label');
  const prev = document.getElementById('prev-week');
  const next = document.getElementById('next-week');
  if (!prev || !next) return;

  function updateLabel() {
    const dates = getWeekDates(currentWeek);
    const fmt = (d) => `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`;
    label.textContent = `Tuần ${currentWeek + 1} (${fmt(dates[0])} – ${fmt(dates[5])}/${dates[5].getFullYear()})`;
  }

  prev.addEventListener('click', () => {
    if (currentWeek > 0) { currentWeek--; updateLabel(); renderScheduleGrid(); }
  });
  next.addEventListener('click', () => {
    if (currentWeek < 15) { currentWeek++; updateLabel(); renderScheduleGrid(); }
  });
  updateLabel();
}

function renderScheduleGrid() {
  const grid = document.getElementById('schedule-grid');
  if (!grid) return;

  const registered = getRegistered();
  const regData = registered.map(r => {
    const course = MOCK_COURSES.find(c => c.id === r.courseId);
    const cls = course?.classes.find(cl => cl.id === r.classId);
    return { course, cls };
  }).filter(r => r.cls);

  const dates = getWeekDates(currentWeek);
  const fmt = (d) => `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`;

  /* Build cells map: dayIdx -> periodIdx -> regData */
  const cellMap = {};
  for (let d = 0; d < 6; d++) cellMap[d] = {};
  for (const r of regData) {
    const dayIdx = DAY_LABELS.indexOf(r.cls.day);
    if (dayIdx < 0) continue;
    const firstPeriod = r.cls.periods[0];
    const span = r.cls.periods.length;
    if (!cellMap[dayIdx][firstPeriod]) {
      cellMap[dayIdx][firstPeriod] = { ...r, span };
    }
    // Mark occupied periods
    for (const p of r.cls.periods) {
      if (p !== firstPeriod) cellMap[dayIdx][p] = 'occupied';
    }
  }

  let html = '';

  /* Header row */
  html += `<div class="sched-header-cell">Tiết</div>`;
  for (let d = 0; d < 6; d++) {
    html += `<div class="sched-header-cell">${DAY_LABELS[d]}<br><small style="font-weight:400;opacity:0.8">${fmt(dates[d])}</small></div>`;
  }

  /* Period rows */
  for (const p of PERIOD_TIMES) {
    /* Time label */
    html += `<div class="sched-time-cell"><strong>${p.period}</strong><br>${p.start}</div>`;

    /* Day cells */
    for (let d = 0; d < 6; d++) {
      const cell = cellMap[d][p.period];
      if (cell === 'occupied') continue; // merged cell, skip
      if (cell && cell.course) {
        const span = cell.span;
        const c = cell.course;
        const cls = cell.cls;
        html += `
        <div class="sched-cell" style="grid-row: span ${span}; background: ${c.color}18">
          <div class="sched-block" style="background:${c.color}"
            data-course="${c.name}" data-teacher="${cls.teacher}" data-room="${cls.room}"
            data-period="Tiết ${cls.periods[0]}–${cls.periods[cls.periods.length-1]}"
            data-day="${cls.day}"
            onmouseenter="showSchedTooltip(event, this)"
            onmouseleave="hideSchedTooltip()">
            <div class="sched-block-name">${c.name}</div>
            <div class="sched-block-room"><i class="fa-solid fa-location-dot"></i> ${cls.room}</div>
          </div>
        </div>`;
      } else {
        html += `<div class="sched-cell"></div>`;
      }
    }
  }

  grid.innerHTML = html;

  /* Empty state */
  if (registered.length === 0) {
    grid.insertAdjacentHTML('beforeend', `
      <div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--secondary)">
        <i class="fa-solid fa-calendar-xmark" style="font-size:2.5rem;margin-bottom:1rem;display:block"></i>
        Chưa có môn học nào. <a href="courses.html">Đăng ký môn học →</a>
      </div>`);
  }
}

function showSchedTooltip(event, el) {
  const tooltip = document.getElementById('sched-tooltip');
  if (!tooltip) return;
  tooltip.innerHTML = `
    <strong>${el.dataset.course}</strong><br>
    <i class="fa-solid fa-user"></i> ${el.dataset.teacher}<br>
    <i class="fa-solid fa-location-dot"></i> ${el.dataset.room}<br>
    <i class="fa-solid fa-clock"></i> ${el.dataset.day} · ${el.dataset.period}
  `;
  tooltip.classList.remove('hidden');
  updateTooltipPos(event);
  el.addEventListener('mousemove', updateTooltipPos);
}

function updateTooltipPos(event) {
  const tooltip = document.getElementById('sched-tooltip');
  if (!tooltip) return;
  tooltip.style.left = (event.clientX + 14) + 'px';
  tooltip.style.top = (event.clientY + 14) + 'px';
}

function hideSchedTooltip() {
  const tooltip = document.getElementById('sched-tooltip');
  if (tooltip) tooltip.classList.add('hidden');
}

/* =========================================
   PAGE: TUITION (tuition.html)
   ========================================= */
function initTuitionPage() {
  if (!document.getElementById('tuition-table-body')) return;
  if (!requireLogin()) return;

  initSidebarUser();
  initSidebarToggle();
  initLogout();

  const user = getUser();
  const registered = getRegistered();
  const isPaid = localStorage.getItem('sc_paid') === '1';

  const regCourses = registered.map(r => {
    const course = MOCK_COURSES.find(c => c.id === r.courseId);
    return course || null;
  }).filter(Boolean);

  const totalCredits = regCourses.reduce((s, c) => s + c.credits, 0);
  const totalFee = totalCredits * CREDIT_PRICE;

  /* Stats */
  document.getElementById('t-courses').textContent = regCourses.length;
  document.getElementById('t-credits').textContent = totalCredits;
  document.getElementById('t-fee').textContent = totalFee.toLocaleString('vi-VN') + ' ₫';

  /* Status banner */
  const banner = document.getElementById('tuition-banner');
  const badge = document.getElementById('t-status-badge');
  if (isPaid) {
    banner.className = 'tuition-status-banner paid';
    banner.innerHTML = `<i class="fa-solid fa-circle-check"></i>
      <span>Học phí học kỳ này đã được <strong>thanh toán đầy đủ</strong>. Cảm ơn bạn!</span>`;
    badge.className = 'tuition-badge paid';
    badge.textContent = '✔ Đã thanh toán';
  } else {
    banner.className = 'tuition-status-banner unpaid';
    banner.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i>
      <span>Học phí học kỳ này <strong>chưa được thanh toán</strong>. Hạn đóng: <strong>15/10/2026</strong>.</span>`;
    badge.className = 'tuition-badge unpaid';
    badge.textContent = '⏳ Chưa thanh toán';
  }

  /* Table */
  const tbody = document.getElementById('tuition-table-body');
  const emptyEl = document.getElementById('tuition-empty');

  if (regCourses.length === 0) {
    tbody.closest('table').style.display = 'none';
    emptyEl.classList.remove('hidden');
    document.getElementById('payment-card').style.display = 'none';
  } else {
    tbody.innerHTML = regCourses.map((c, i) => `
      <tr>
        <td><code>${c.code}</code></td>
        <td>${c.name}</td>
        <td>
          <span class="cc-type-badge ${c.type === 'Bắt buộc' ? 'badge-required' : 'badge-elective'}">
            ${c.type}
          </span>
        </td>
        <td style="text-align:center"><strong>${c.credits}</strong></td>
        <td>${CREDIT_PRICE.toLocaleString('vi-VN')} ₫</td>
        <td style="font-weight:700;color:var(--primary-dark)">
          ${(c.credits * CREDIT_PRICE).toLocaleString('vi-VN')} ₫
        </td>
      </tr>
    `).join('');

    /* Footer totals */
    document.getElementById('tuition-tfoot').innerHTML = `
      <tr>
        <td colspan="3" style="color:var(--secondary)">Phí quản lý sinh viên</td>
        <td></td>
        <td>1 lần</td>
        <td style="font-weight:700">150.000 ₫</td>
      </tr>
      <tr class="tuition-total-row">
        <td colspan="3"><strong>TỔNG CỘNG</strong></td>
        <td style="text-align:center"><strong>${totalCredits} TC</strong></td>
        <td></td>
        <td style="font-size:1.1rem;color:var(--red)"><strong>${(totalFee + 150000).toLocaleString('vi-VN')} ₫</strong></td>
      </tr>`;

    /* Bank info */
    const bankContent = `HOCPHI HK1 2025 – ${user.mssv}`;
    const el = (id) => document.getElementById(id);
    if (el('bank-content')) el('bank-content').textContent = bankContent;
    if (el('momo-content')) el('momo-content').textContent = bankContent;
    if (el('bank-amount')) el('bank-amount').textContent = (totalFee + 150000).toLocaleString('vi-VN') + ' ₫';
  }

  /* Payment method toggle */
  document.querySelectorAll('input[name="pay-method"]').forEach(radio => {
    radio.addEventListener('change', () => {
      document.getElementById('pay-bank-info').classList.add('hidden');
      document.getElementById('pay-momo-info').classList.add('hidden');
      document.getElementById('pay-cash-info').classList.add('hidden');
      const map = { bank: 'pay-bank-info', momo: 'pay-momo-info', cash: 'pay-cash-info' };
      document.getElementById(map[radio.value]).classList.remove('hidden');
    });
  });
}

/* Copy bank transfer content */
function copyBankContent() {
  const user = getUser();
  const text = `HOCPHI HK1 2025 – ${user?.mssv || ''}`;
  navigator.clipboard.writeText(text).then(() => {
    showToast('✅ Đã sao chép nội dung chuyển khoản!');
  });
}

/* Simulate payment */
function simulatePayment() {
  const registered = getRegistered();
  if (registered.length === 0) return;
  if (confirm('Xác nhận bạn đã hoàn tất thanh toán học phí?\n(Thao tác này chỉ mang tính demo.)')) {
    localStorage.setItem('sc_paid', '1');
    showToast('✅ Ghi nhận thanh toán thành công!');
    setTimeout(() => location.reload(), 1500);
  }
}

/* =========================================
   PAGE: SETTINGS (settings.html)
   ========================================= */
function initSettingsPage() {
  if (!document.getElementById('profile-form')) return;
  if (!requireLogin()) return;

  initSidebarUser();
  initSidebarToggle();
  initLogout();

  const user = getUser();
  const EMAIL_DOMAIN = '@lachong.edu.vn';
  const MAJOR_NAMES = {
    CNTT: 'Công nghệ thông tin', KTPM: 'Kỹ thuật phần mềm',
    KHMT: 'Khoa học máy tính', HTTT: 'Hệ thống thông tin', MMT: 'Mạng máy tính & Truyền thông'
  };

  /* --- Tab switching --- */
  document.querySelectorAll('.settings-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.settings-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
    });
  });

  /* --- Populate profile form --- */
  const emailPrefix = (user.email || user.mssv).replace(EMAIL_DOMAIN, '');
  document.getElementById('s-mssv').value = user.mssv;
  document.getElementById('s-name').value = user.name;
  document.getElementById('s-email-prefix').value = emailPrefix;
  document.getElementById('s-email-full').textContent = emailPrefix + EMAIL_DOMAIN;
  document.getElementById('s-phone').value = user.phone || '';
  document.getElementById('s-address').value = user.address || '';
  document.getElementById('s-major').value = user.major || 'CNTT';
  document.getElementById('s-year').value = user.year || 1;

  /* Avatar */
  const avatarBig = document.getElementById('profile-avatar-big');
  const nameDisplay = document.getElementById('profile-name-display');
  const majorDisplay = document.getElementById('profile-major-display');
  nameDisplay.textContent = user.name;
  majorDisplay.textContent = `${MAJOR_NAMES[user.major] || user.major} · Năm ${user.year}`;
  const parts = user.name.trim().split(' ');
  avatarBig.textContent = (parts.length >= 2
    ? parts[0][0] + parts[parts.length - 1][0]
    : user.name.slice(0, 2)).toUpperCase();

  /* Avatar upload preview */
  document.getElementById('avatar-upload').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      avatarBig.innerHTML = `<img src="${ev.target.result}" alt="avatar" />`;
      document.getElementById('sidebar-avatar').textContent = '';
      document.getElementById('sidebar-avatar').style.backgroundImage = `url(${ev.target.result})`;
      document.getElementById('sidebar-avatar').style.backgroundSize = 'cover';
    };
    reader.readAsDataURL(file);
  });

  /* Live email preview */
  document.getElementById('s-email-prefix').addEventListener('input', (e) => {
    document.getElementById('s-email-full').textContent = (e.target.value || '...') + EMAIL_DOMAIN;
  });

  /* Save profile */
  document.getElementById('profile-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const newName = document.getElementById('s-name').value.trim();
    const newPrefix = document.getElementById('s-email-prefix').value.trim();
    const newMajor = document.getElementById('s-major').value;
    const newYear = +document.getElementById('s-year').value;

    user.name = newName;
    user.email = newPrefix + EMAIL_DOMAIN;
    user.phone = document.getElementById('s-phone').value.trim();
    user.address = document.getElementById('s-address').value.trim();
    user.major = newMajor;
    user.majorName = MAJOR_NAMES[newMajor] || newMajor;
    user.year = newYear;
    setUser(user);

    // Sync to persistent users list
    const allU = getAllUsers();
    const uIdx = allU.findIndex(u => u.mssv.toLowerCase() === user.mssv.toLowerCase());
    if (uIdx !== -1) {
      allU[uIdx] = { ...allU[uIdx], ...user };
      saveAllUsers(allU);
    }

    // Update display
    nameDisplay.textContent = newName;
    majorDisplay.textContent = `${MAJOR_NAMES[newMajor]} · Năm ${newYear}`;
    document.getElementById('sidebar-name').textContent = newName;
    const p2 = newName.trim().split(' ');
    const initials = (p2.length >= 2 ? p2[0][0] + p2[p2.length - 1][0] : newName.slice(0, 2)).toUpperCase();
    if (!avatarBig.querySelector('img')) avatarBig.textContent = initials;

    const suc = document.getElementById('profile-success');
    suc.classList.remove('hidden');
    setTimeout(() => suc.classList.add('hidden'), 3000);
    showToast('✅ Đã lưu thông tin cá nhân!');
  });

  /* Reset profile */
  document.getElementById('btn-reset-profile').addEventListener('click', () => {
    document.getElementById('profile-form').reset();
    document.getElementById('s-mssv').value = user.mssv;
    document.getElementById('s-name').value = user.name;
    document.getElementById('s-email-prefix').value = emailPrefix;
    document.getElementById('s-major').value = user.major;
    document.getElementById('s-year').value = user.year;
  });

  /* --- Password change form --- */
  /* Password toggles */
  document.querySelectorAll('.toggle-pw-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling;
      const isText = input.type === 'text';
      input.type = isText ? 'password' : 'text';
      btn.innerHTML = isText ? '<i class="fa-solid fa-eye"></i>' : '<i class="fa-solid fa-eye-slash"></i>';
    });
  });

  /* New password strength */
  const pwNewInput = document.getElementById('pw-new');
  if (pwNewInput) {
    pwNewInput.addEventListener('input', () => {
      applyPwStrength(pwNewInput.value, 'pw-new-bar', 'pw-new-strength');
    });
  }

  document.getElementById('pw-change-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const errDiv = document.getElementById('pw-change-error');
    const errMsg = document.getElementById('pw-change-err-msg');
    const sucDiv = document.getElementById('pw-change-success');
    errDiv.classList.add('hidden');

    const current = document.getElementById('pw-current').value;
    const newPw = document.getElementById('pw-new').value;
    const newPw2 = document.getElementById('pw-new2').value;

    if (current !== user.password) {
      errMsg.textContent = 'Mật khẩu hiện tại không đúng!';
      errDiv.classList.remove('hidden'); return;
    }
    if (newPw.length < 6) {
      errMsg.textContent = 'Mật khẩu mới phải có ít nhất 6 ký tự!';
      errDiv.classList.remove('hidden'); return;
    }
    if (newPw !== newPw2) {
      errMsg.textContent = 'Mật khẩu xác nhận không khớp!';
      errDiv.classList.remove('hidden'); return;
    }

    user.password = newPw;
    setUser(user);

    // Sync new password to persistent users list
    const allUsers = getAllUsers();
    const pIdx = allUsers.findIndex(u => u.mssv.toLowerCase() === user.mssv.toLowerCase());
    if (pIdx !== -1) {
      allUsers[pIdx].password = newPw;
      saveAllUsers(allUsers);
    }

    document.getElementById('pw-change-form').reset();
    sucDiv.classList.remove('hidden');
    setTimeout(() => sucDiv.classList.add('hidden'), 3000);
    showToast('✅ Đổi mật khẩu thành công!');
  });
}

/* Helper: password strength bar */
function applyPwStrength(val, barId, labelId) {
  let strength = 0;
  if (val.length >= 6) strength++;
  if (val.length >= 10) strength++;
  if (/[A-Z]/.test(val)) strength++;
  if (/[0-9]/.test(val)) strength++;
  if (/[^A-Za-z0-9]/.test(val)) strength++;
  const pct = (strength / 5) * 100;
  const bar = document.getElementById(barId);
  const label = document.getElementById(labelId);
  if (!bar || !label) return;
  bar.style.width = pct + '%';
  if (strength <= 1) { bar.style.background = '#ef4444'; label.textContent = 'Yếu'; label.style.color = '#ef4444'; }
  else if (strength <= 3) { bar.style.background = '#f59e0b'; label.textContent = 'Trung bình'; label.style.color = '#f59e0b'; }
  else { bar.style.background = '#10b981'; label.textContent = 'Mạnh'; label.style.color = '#10b981'; }
}

/* Save notification settings */
function saveNotifSettings() {
  showToast('✅ Đã lưu tùy chọn thông báo!');
}

/* =========================================
   PAGE: FORGOT PASSWORD (forgot-password.html)
   ========================================= */
function initForgotPasswordPage() {
  if (!document.getElementById('fp-form-step1')) return;

  const EMAIL_DOMAIN = '@lachong.edu.vn';
  let verifiedUser = null;

  /* Password toggle buttons */
  document.querySelectorAll('.toggle-pw-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling;
      const isText = input.type === 'text';
      input.type = isText ? 'password' : 'text';
      btn.innerHTML = isText ? '<i class="fa-solid fa-eye"></i>' : '<i class="fa-solid fa-eye-slash"></i>';
    });
  });

  /* Password strength meter */
  const fpPwInput = document.getElementById('fp-new-pw');
  if (fpPwInput) {
    fpPwInput.addEventListener('input', () => {
      applyPwStrength(fpPwInput.value, 'fp-pw-bar', 'fp-pw-strength');
    });
  }

  /* STEP 1: Verify identity */
  document.getElementById('fp-form-step1').addEventListener('submit', (e) => {
    e.preventDefault();
    const mssvInput = document.getElementById('fp-mssv').value.trim();
    const rawEmailInput = document.getElementById('fp-email-prefix').value.trim();
    const errDiv = document.getElementById('fp-error');
    const errMsg = document.getElementById('fp-error-msg');
    errDiv.classList.add('hidden');

    const users = getAllUsers();
    // Search user by MSSV (case-insensitive)
    const found = users.find(u => u.mssv.toLowerCase() === mssvInput.toLowerCase());
    if (!found) {
      errMsg.textContent = `Không tìm thấy tài khoản với mã số sinh viên "${mssvInput}"! Vui lòng kiểm tra lại.`;
      errDiv.classList.remove('hidden');
      return;
    }

    // Flexible email check
    // The user might type: "22110001", "22110001@lachong.edu.vn", or a custom email
    const registeredEmail = (found.email || `${found.mssv}${EMAIL_DOMAIN}`).toLowerCase().trim();
    const registeredPrefix = registeredEmail.split('@')[0].trim();
    const inputClean = rawEmailInput.toLowerCase().trim();
    const inputPrefix = inputClean.split('@')[0].trim();
    const inputFull = inputClean.includes('@') ? inputClean : `${inputClean}${EMAIL_DOMAIN.toLowerCase()}`;
    const expectedDefaultEmail = `${found.mssv.toLowerCase()}${EMAIL_DOMAIN.toLowerCase()}`;

    const isMatch = (
      inputClean === registeredEmail ||
      inputFull === registeredEmail ||
      inputPrefix === registeredPrefix ||
      inputPrefix === found.mssv.toLowerCase() ||
      inputFull === expectedDefaultEmail
    );

    if (!isMatch) {
      errMsg.textContent = `Email không khớp với mã số sinh viên ${found.mssv}! Vui lòng nhập đúng email trường (VD: ${found.mssv}@lachong.edu.vn)`;
      errDiv.classList.remove('hidden');
      return;
    }

    verifiedUser = found;
    errDiv.classList.add('hidden');

    // Transition to step 2 smoothly
    document.getElementById('card-step1').classList.add('hidden');
    const card2 = document.getElementById('card-step2');
    card2.classList.remove('hidden');
    document.getElementById('fp-verified-mssv').textContent = `${found.name} (${found.mssv})`;
  });

  /* STEP 2: Set new password */
  document.getElementById('fp-form-step2').addEventListener('submit', (e) => {
    e.preventDefault();
    const newPw = document.getElementById('fp-new-pw').value;
    const newPw2 = document.getElementById('fp-new-pw2').value;
    const errDiv = document.getElementById('fp-pw-error');
    const errMsg = document.getElementById('fp-pw-error-msg');
    errDiv.classList.add('hidden');

    if (newPw.length < 6) {
      errMsg.textContent = 'Mật khẩu phải có ít nhất 6 ký tự!';
      errDiv.classList.remove('hidden'); return;
    }
    if (newPw !== newPw2) {
      errMsg.textContent = 'Mật khẩu xác nhận không khớp!';
      errDiv.classList.remove('hidden'); return;
    }

    // Update password in localStorage users list
    const users = getAllUsers();
    const idx = users.findIndex(u => u.mssv.toLowerCase() === verifiedUser.mssv.toLowerCase());
    if (idx !== -1) {
      users[idx].password = newPw;
      saveAllUsers(users);
    }
    verifiedUser.password = newPw;

    // Update session user if currently logged in
    const currentUser = getUser();
    if (currentUser && currentUser.mssv.toLowerCase() === verifiedUser.mssv.toLowerCase()) {
      currentUser.password = newPw;
      setUser(currentUser);
    }

    document.getElementById('fp-form-step2').style.display = 'none';
    document.getElementById('fp-success').classList.remove('hidden');
    setTimeout(() => { window.location.href = 'index.html'; }, 2000);
  });
}

/* =========================================
   ROUTER – detect page and init
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  const page = path.split('/').pop() || 'index.html';

  if (page === 'index.html' || page === '') initLoginPage();
  else if (page === 'register.html') initRegisterPage();
  else if (page === 'home.html') initHomePage();
  else if (page === 'courses.html') initCoursesPage();
  else if (page === 'schedule.html') initSchedulePage();
  else if (page === 'tuition.html') initTuitionPage();
  else if (page === 'settings.html') initSettingsPage();
  else if (page === 'forgot-password.html') initForgotPasswordPage();
});
