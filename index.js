/* SmartCourse – home.js : logic trang chủ (nạp sau script.js để dùng dữ liệu chung) */
document.addEventListener('DOMContentLoaded', () => {
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const vnd = (n) => n.toLocaleString('vi-VN') + ' ₫';

  /* ---------- Chế độ sáng / tối ---------- */
  const setMode = (t) => {
    document.documentElement.dataset.theme = t;
    $('#mode-btn').innerHTML = `<i class="fa-solid fa-${t === 'dark' ? 'sun' : 'moon'}"></i>`;
    $('#mode-btn').title = t === 'dark' ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối';
  };
  setMode(document.documentElement.dataset.theme || 'light');
  $('#mode-btn').addEventListener('click', () => {
    const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('sc_theme', t); } catch (e) { }
    setMode(t);
  });

  /* ---------- Menu mobile ---------- */
  const toggleSide = (open) => { $('#side').classList.toggle('open', open); $('#overlay').classList.toggle('show', open); };
  $('#menu').addEventListener('click', () => toggleSide(!$('#side').classList.contains('open')));
  $('#overlay').addEventListener('click', () => toggleSide(false));

  /* ---------- Dữ liệu môn học dùng chung với đăng ký / học phí / thời khóa biểu ---------- */
  const DAYS = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  const COURSE_COLORS = ['#0d9488', '#0ea5e9', '#8b5cf6', '#f59e0b', '#ef6472', '#22c55e'];
  const COURSE_CATALOG = typeof MOCK_DATA !== 'undefined' && Array.isArray(MOCK_DATA) ? MOCK_DATA : [];
  const COURSES = COURSE_CATALOG.map((course, index) => {
    const options = typeof DEMO_CLASS_OPTIONS !== 'undefined'
      ? DEMO_CLASS_OPTIONS.get(course.id) || []
      : [];
    return {
      ...course,
      color: COURSE_COLORS[index % COURSE_COLORS.length],
      classes: options.map((section) => ({
        id: section.section,
        day: DAYS[section.day],
        periods: Array.from({ length: section.end - section.start + 1 }, (_, offset) => section.start + offset),
        room: section.room,
        max: course.slots,
        enrolled: course.enrolled
      }))
    };
  });
  const PT = typeof PERIOD_TIMES !== 'undefined' ? PERIOD_TIMES
    : Array.from({ length: 12 }, (_, i) => ({ period: i + 1, start: String(7 + i).padStart(2, '0') + ':00', end: String(7 + i).padStart(2, '0') + ':50' }));
  const PRICE = typeof CREDIT_PRICE === 'number' ? CREDIT_PRICE : 500000;
  const HOME_BASE_FEE = typeof BASE_FEE === 'number' ? BASE_FEE : 150000;
  const read = (store, key, def) => { try { const r = store.getItem(key); return r ? JSON.parse(r) : def; } catch (e) { return def; } };
  const DEFAULT_NEWS = [
    { id: 1, title: 'Hạn đăng ký môn học: 15/10/2026', desc: 'Hệ thống đăng ký môn HK1 sẽ đóng vào 23:59 ngày 15/10. Vui lòng hoàn tất đăng ký.', time: '10 phút trước', type: 'urgent', icon: 'fa-triangle-exclamation', unread: true, link: 'Courses/courses.html' },
    { id: 2, title: 'Nhắc nhở học phí HK1 – 2025/2026', desc: 'Hạn nộp học phí trước ngày 15/10/2026. Kiểm tra chi tiết trong mục Học phí.', time: '2 giờ trước', type: 'warning', icon: 'fa-receipt', unread: true, link: 'Tuition/tuition.html' },
    { id: 3, title: 'Lịch thi giữa kỳ đã cập nhật', desc: 'Đã có lịch thi các môn chuyên ngành trên cổng thời khóa biểu.', time: '1 ngày trước', type: 'info', icon: 'fa-calendar-days', unread: true, link: 'Schedule/Schedule.html' },
    { id: 4, title: 'Học bổng khuyến học đợt 2 mở nộp đơn', desc: 'Sinh viên có GPA ≥ 3.2 có thể nộp hồ sơ xét học bổng khuyến học đến 20/10/2026.', time: '2 ngày trước', type: 'success', icon: 'fa-award', unread: true, link: 'index.html' }
  ];
  const resolveNewsLink = (link) => ({
    'courses.html': 'Courses/courses.html',
    'login.html': 'Login_Register/login.html',
    'Login/Register/login.html': 'Login_Register/login.html',
    'register.html': 'Login_Register/register.html',
    'Login/Register/register.html': 'Login_Register/register.html',
    'settings.html': 'Settings/settings.html',
    'tuition.html': 'Tuition/tuition.html',
    'home.html': 'index.html'
  }[link] || link);
  const getNews = () => (read(localStorage, 'sc_notifications', null) || DEFAULT_NEWS.map(x => ({ ...x })))
    .map(item => ({ ...item, link: resolveNewsLink(item.link) }));
  const setNews = (l) => { try { localStorage.setItem('sc_notifications', JSON.stringify(l)); } catch (e) { } };
  const toast = (m) => { if (typeof showToast === 'function') showToast(m); };
  const getU = () => read(sessionStorage, 'sc_user', null);
  const getReg = () => {
    const registrations = readStudentData('sc_registered', null);
    if (Array.isArray(registrations)) {
      return registrations
        .map((registration) => Number(typeof registration === 'object' ? registration.courseId : registration))
        .filter(Number.isFinite);
    }
    const legacyIds = readStudentData('sc_registered_courses', []);
    return Array.isArray(legacyIds) ? legacyIds.map(Number).filter(Number.isFinite) : [];
  };
  const getConfirmedIds = () => {
    const confirmedIds = readStudentData('sc_confirmed_courses', []);
    return Array.isArray(confirmedIds)
      ? new Set(confirmedIds.map(Number).filter(Number.isFinite))
      : new Set();
  };
  const readStudentData = (key, fallback) => {
    try {
      const value = getStudentStorageItem(key);
      return value === null ? fallback : JSON.parse(value);
    } catch (error) {
      console.error(`Không thể đọc dữ liệu sinh viên "${key}".`, error);
      return fallback;
    }
  };

  /* ---------- Hằng số & dữ liệu ---------- */
  const DEADLINE = new Date(2026, 9, 15, 23, 59, 59); // đổi hạn đăng ký tại đây
  const MAX = 21, GRAD = 130, FEE0 = HOME_BASE_FEE;
  const user = getU(), now = new Date();
  const toMin = (t) => { const [h, m] = t.split(':'); return +h * 60 + +m; };
  const per = (p) => PT.find(x => x.period === p);
  const slot = (c) => ({ s: per(c.periods[0]).start, e: per(c.periods[c.periods.length - 1]).end });

  /* ---------- Tài khoản: đăng nhập / đã đăng nhập ---------- */
  if (user) {
    const p = user.name.trim().split(' ');
    const ini = (p.length > 1 ? p[0][0] + p[p.length - 1][0] : user.name.slice(0, 2)).toUpperCase();
    $('#guest').classList.add('hidden'); $('#user').classList.remove('hidden');
    $('#side-user').classList.remove('hidden'); $('#side-logout').classList.remove('hidden');
    ['#me-av', '#side-av'].forEach(s => {
      const avatar = $(s);
      avatar.textContent = '';
      if (typeof user.avatar === 'string' && user.avatar.startsWith('data:image/')) {
        const image = document.createElement('img');
        image.src = user.avatar;
        image.alt = '';
        image.className = 'avatar-image';
        avatar.appendChild(image);
      } else {
        avatar.textContent = ini;
      }
    });
    $('#me-short').textContent = p[p.length - 1];
    ['#me-name', '#side-name'].forEach(s => $(s).textContent = user.name);
    ['#me-id', '#side-id'].forEach(s => $(s).textContent = user.mssv);
  }
  document.querySelectorAll('.js-logout').forEach(b => b.addEventListener('click', () => {
    sessionStorage.clear(); localStorage.removeItem('sc_cart');
    window.location.href = 'index.html';
  }));

  /* ---------- Popover: thông báo & tài khoản ---------- */
  const pops = [['#notif-btn', '#notif-pop'], ['#me-btn', '#me-pop']];
  pops.forEach(([b, p]) => $(b).addEventListener('click', (e) => {
    e.stopPropagation();
    pops.forEach(([, q]) => q !== p && $(q).classList.add('hidden'));
    $(p).classList.toggle('hidden');
  }));
  document.addEventListener('click', (e) => pops.forEach(([, p]) => {
    if (!$(p).contains(e.target) || e.target.closest('a')) $(p).classList.add('hidden');
  }));

  /* ---------- Thông báo = Bảng tin (cùng một nguồn dữ liệu) ---------- */
  function renderNews() {
    const list = getNews(), unread = list.filter(n => n.unread).length;
    const badge = $('#notif-n'); badge.textContent = unread; badge.classList.toggle('hidden', !unread);
    $('#bulletin-n').textContent = list.length;
    $('#notif-list').innerHTML = list.map(n => `<a class="nitem ${n.unread ? 'unread' : ''}" href="${n.link || '#'}" data-id="${n.id}">
      <span class="ni ${n.type}"><i class="fa-solid ${n.icon}"></i></span>
      <span><b>${n.title}</b><small>${n.desc}</small><em><i class="fa-regular fa-clock"></i> ${n.time}</em></span></a>`).join('');
    $('#bulletin-list').innerHTML = list.map(n => `<a class="ann ${n.type} ${n.unread ? 'unread' : ''}" href="${n.link || '#'}" data-id="${n.id}">
      <span class="ni ${n.type}"><i class="fa-solid ${n.icon}"></i></span>
      <div><b>${n.title}</b><p>${n.desc}</p><em><i class="fa-regular fa-clock"></i> ${n.time}</em></div></a>`).join('');
  }
  document.addEventListener('click', (e) => {
    const a = e.target.closest('.nitem, .ann'); if (!a) return;
    const list = getNews(), n = list.find(x => x.id === +a.dataset.id);
    if (n && n.unread) { n.unread = false; setNews(list); renderNews(); }
  });
  $('#notif-all').addEventListener('click', (e) => {
    e.stopPropagation();
    const list = getNews(); list.forEach(n => n.unread = false);
    setNews(list); renderNews(); toast('✅ Đã đánh dấu tất cả thông báo là đã đọc');
  });

  /* ---------- Thành phần giao diện ---------- */
  const stat = (href, c, icon, v, l) => `<a class="stat" href="${href}" style="--c:${c}"><span class="si"><i class="fa-solid ${icon}"></i></span><span><b>${v}</b><small>${l}</small></span></a>`;
  const card = (icon, title, link, body) => `<section class="card"><div class="card-h"><h3><i class="fa-solid ${icon}"></i> ${title}</h3>${link || ''}</div><div class="card-b">${body}</div></section>`;
  const banner = (h1, sub, actions, pill, side) => `<section class="banner"><div><h1>${h1}</h1><p>${sub}</p><div class="bn-act">${actions}</div>${pill || ''}</div></section>`;

  function nextOf(items) {
    const nowMin = now.getHours() * 60 + now.getMinutes();
    for (let d = 0; d < 7; d++) {
      const g = new Date(now.getTime() + d * 864e5).getDay();
      if (!g) continue;
      const list = items.filter(i => i.day === DAYS[g - 1] && (d > 0 || toMin(i.s) > nowMin)).sort((a, b) => toMin(a.s) - toMin(b.s));
      if (list.length) return { ...list[0], d, g };
    }
  }
  function nextCard(items) {
    const nx = nextOf(items);
    if (!nx) return '<div class="glass"><small>Lớp tiếp theo</small><b>Chưa có lớp sắp tới 🎈</b><p>Lịch học sẽ hiện ở đây khi có lớp.</p></div>';
    const when = nx.d === 0 ? 'Hôm nay' : nx.d === 1 ? 'Ngày mai' : DAYS[nx.g - 1];
    const left = toMin(nx.s) - (now.getHours() * 60 + now.getMinutes());
    return `<div class="glass"><small>Lớp tiếp theo</small><b>${nx.name}</b><p><i class="fa-regular fa-clock"></i> ${when} · ${nx.s} – ${nx.e}</p>
      <p><i class="fa-solid fa-location-dot"></i> Phòng ${nx.room}</p><span class="cd">${nx.d === 0 ? `Còn ${left >= 60 ? Math.floor(left / 60) + ' giờ ' : ''}${left % 60} phút` : when}</span></div>`;
  }
  const lastName = () => esc(user.name.trim().split(' ').pop());

  /* ---------- Khách (chưa đăng nhập) ---------- */
  function guest() {
    const classes = COURSES.reduce((s, c) => s + c.classes.length, 0);
    $('#banner').innerHTML = banner('Chào mừng đến với SmartCourse LHU 👋',
      'Cổng đăng ký môn học thông minh: chọn môn, xếp lịch học và theo dõi học phí chỉ trong vài bước.',
      '<a class="bn-btn w" href="Login_Register/login.html"><i class="fa-solid fa-right-to-bracket"></i> Đăng nhập</a><a class="bn-btn g" href="Login_Register/register.html"><i class="fa-solid fa-user-plus"></i> Tạo tài khoản</a>');
    $('#stats').innerHTML = stat('Courses/courses.html', '#0d9488', 'fa-book-open', COURSES.length, 'Môn học đang mở') +
      stat('Courses/courses.html', '#22c55e', 'fa-people-group', classes, 'Lớp học phần') +
      stat('index.html', '#0ea5e9', 'fa-layer-group', MAX, 'Tín chỉ tối đa mỗi học kỳ') +
      stat('Tuition/tuition.html', '#ff9f1c', 'fa-coins', vnd(PRICE), 'Học phí mỗi tín chỉ');
    const how = [['Đăng nhập', 'Đăng nhập bằng mã số sinh viên và mật khẩu'], ['Chọn môn & lớp', 'Hệ thống tự kiểm tra trùng lịch và giới hạn tín chỉ'],
    ['Xem thời khóa biểu', 'Lịch tuần hiển thị trực quan, có phòng học'], ['Đóng học phí', 'Theo dõi số tiền và hạn nộp']];
    const open = COURSES.slice(0, 6).map(c => {
      const left = c.classes.reduce((s, x) => s + x.max - x.enrolled, 0);
      return `<li><span class="dot" style="background:${c.color}"></span><div><b>${c.name}</b><small>${c.code} · ${c.classes.length} lớp · còn ${left} chỗ</small></div><span class="tc">${c.credits} TC</span></li>`;
    }).join('');
    $('#two').innerHTML = card('route', 'Đăng ký chỉ với 4 bước', '', `<ol class="steps">${how.map((s, i) => `<li><span class="n">${i + 1}</span><div><b>${s[0]}</b><small>${s[1]}</small></div></li>`).join('')}</ol>`) +
      card('fire', 'Môn học đang mở', '<a href="Login_Register/login.html">Đăng nhập để đăng ký →</a>', `<ul class="list">${open}</ul>`);
    $('#extra').innerHTML = '';
  }

  /* ---------- Sinh viên ---------- */
  function student() {
    const registered = getReg().map((courseId) => {
      const course = COURSES.find((item) => item.id === courseId);
      return course ? { c: course, cl: course.classes[0] } : null;
    }).filter(Boolean);
    const confirmedIds = getConfirmedIds();
    const confirmed = registered.filter(({ c }) => confirmedIds.has(c.id));
    const n = registered.length;
    const tc = registered.reduce((sum, { c }) => sum + Number(c.credits || 0), 0);
    const confirmedCredits = confirmed.reduce((sum, { c }) => sum + Number(c.credits || 0), 0);
    const totalFee = n ? tc * PRICE + FEE0 : 0;
    const paid = String(readStudentData('sc_paid', '0')) === '1';
    const outstandingFee = paid ? 0 : totalFee;
    const items = confirmed.map(({ c, cl }) => ({
      day: cl.day,
      name: c.name,
      color: c.color,
      room: cl.room,
      credits: c.credits,
      ...slot(cl)
    }));
    const diff = DEADLINE - now;
    const pill = diff > 0
      ? `<span class="pill"><i class="fa-solid fa-hourglass-half"></i> Còn ${Math.ceil(diff / 864e5)} ngày đến hạn đăng ký (15/10/2026)</span>`
      : '<span class="pill late"><i class="fa-solid fa-triangle-exclamation"></i> Đã qua hạn đăng ký 15/10/2026 – liên hệ phòng Đào tạo nếu cần hỗ trợ</span>';
    $('#banner').innerHTML = banner(`Chúc một ngày tốt lành, ${lastName()}!`, `${esc(user.majorName || user.major || 'Sinh viên LHU')} · Học kỳ 1 – 2025/2026`,
      '<a class="bn-btn w" href="Courses/courses.html"><i class="fa-solid fa-wand-magic-sparkles"></i> Đăng ký môn học</a><a class="bn-btn g" href="Schedule/Schedule.html"><i class="fa-solid fa-calendar-week"></i> Thời khóa biểu</a>', pill, nextCard(items));

    const previousCredits = Number(user.totalCredits || user.completedCredits || 0);
    const total = (Number.isFinite(previousCredits) ? previousCredits : 0) + confirmedCredits;
    const pct = Math.min(100, Math.round(total / GRAD * 100));
    $('#stats').innerHTML = stat('Courses/courses.html', '#0d9488', 'fa-book-open', n, 'Môn đã đăng ký') + stat('Courses/courses.html', '#22c55e', 'fa-circle-check', tc, `Tín chỉ đã đăng ký · ${confirmedCredits} đã xác nhận`) +
      stat('index.html', '#0ea5e9', 'fa-chart-line', total, 'Tổng tín chỉ tích lũy') + stat('Tuition/tuition.html', '#ff9f1c', 'fa-coins', vnd(outstandingFee), paid ? 'Học phí · đã thanh toán' : 'Học phí đang nợ');

    const ring = `<div class="prog"><div class="ring-wrap"><svg class="ring" viewBox="0 0 100 100"><circle class="bg" cx="50" cy="50" r="42"/><circle class="fg" cx="50" cy="50" r="42" pathLength="100" stroke-dasharray="${pct} 100"/></svg>
      <div class="ring-lb"><b>${pct}%</b><small>hoàn thành</small></div></div>
      <div class="prog-d"><div><span>Đã tích lũy</span><b>${total} / ${GRAD} TC</b></div><div class="bar"><i style="width:${pct}%"></i></div><div><span>Cần thêm</span><b>${Math.max(0, GRAD - total)} TC</b></div></div></div>`;
    const courses = n ? `<ul class="list">${registered.map(({ c, cl }) => `<li><span class="dot" style="background:${c.color}"></span><div><b>${c.name}</b><small>${c.code} · ${c.credits} TC · ${confirmedIds.has(c.id) ? 'Đã xác nhận' : 'Chờ xác nhận học phí'}</small></div><span class="tc">${c.credits} TC</span></li>`).join('')}</ul>`
      : '<p class="empty">Chưa đăng ký môn nào. <a href="Courses/courses.html">Đăng ký ngay →</a></p>';
    $('#two').innerHTML = card('chart-pie', 'Tiến độ tốt nghiệp', '', ring) + card('list-check', 'Môn học kỳ này', '<a href="Courses/courses.html">Xem thêm →</a>', courses);

    const ids = registered.map(({ c }) => c.id), sg = [];
    if (!n) sg.push(['#0d9488', 'fa-rocket', 'Bắt đầu với môn bắt buộc', 'Còn chỗ: ' + COURSES.filter(c => c.type === 'Bắt buộc' && c.classes.some(x => x.enrolled < x.max)).slice(0, 3).map(c => c.name).join(', ') + '.', 'Courses/courses.html']);
    else if (tc < MAX) sg.push(['#0d9488', 'fa-circle-plus', `Còn ${MAX - tc} TC có thể đăng ký`, 'Thêm môn tự chọn để đủ tải học tập.', 'Courses/courses.html']);
    const hot = COURSES.filter(c => !ids.includes(c.id)).filter(c => { const l = Math.max(...c.classes.map(x => x.max - x.enrolled)); return l > 0 && l <= 5; }).map(c => c.name);
    if (hot.length) sg.push(['#ff5a4f', 'fa-fire', 'Sắp hết chỗ!', hot.join(', ') + ' chỉ còn vài suất.', 'Courses/courses.html']);
    if (n && !paid) sg.push(['#ff9f1c', 'fa-wallet', 'Học phí đang nợ', `Cần đóng ${vnd(outstandingFee)} trước hạn 15/10/2026.`, 'Tuition/tuition.html']);
    if (n && paid) sg.push(['#22c55e', 'fa-circle-check', 'Mọi thứ đã sẵn sàng', 'Bạn đã đăng ký và đóng học phí. Chúc học kỳ thành công!', 'Schedule/Schedule.html']);
    $('#extra').innerHTML = card('lightbulb', 'Gợi ý thông minh cho bạn', '', `<div class="sugg">${sg.map(s => `<a class="sg" href="${s[4]}" style="--c:${s[0]}"><i class="fa-solid ${s[1]}"></i><div><b>${s[2]}</b><span>${s[3]}</span></div></a>`).join('')}</div>`);
    $('#extra').innerHTML += renderTuitionSyncBox(registered);
    handleSyncTuyenData(registered);
  }

  /* ---------- Khởi chạy ---------- */
  function render() { !user ? guest() : student(); }
  window.addEventListener('storage', (event) => {
    if (!user) return;
    const scopedKeys = ['sc_registered', 'sc_registered_courses', 'sc_confirmed_courses', 'sc_paid']
      .map((key) => getStudentStorageKey(key));
    if (event.key === null || scopedKeys.includes(event.key)) {
      render();
    }
  });
  renderNews();
  render();
});

function renderTuitionSyncBox(reg) {
  const PRICE = 500000;
  const FEE0 = 150000;
  let totalCourseFee = 0;

  const courseRows = reg.map(r => {
    const itemFee = r.c.credits * PRICE;
    totalCourseFee += itemFee;
    return `
      <li style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--line);">
        <div>
          <b style="display: block; font-size: .9rem;">${r.c.name}</b>
          <small style="color: var(--mute); font-size: .78rem;">${r.c.code} | ${r.c.credits} Tín chỉ</small>
        </div>
        <span style="font-weight: 600; color: var(--pri);">${itemFee.toLocaleString('vi-VN')} ₫</span>
      </li>
    `;
  }).join('');

  const totalDisplay = `
    <div style="display: flex; justify-content: space-between; padding-top: 14px; margin-top: 4px; font-weight: 700; font-size: 1.05rem;">
      <span>Tổng phí môn học</span>
      <span style="color: var(--org);">${totalCourseFee.toLocaleString('vi-VN')} ₫</span>
    </div>
    <div style="display: flex; justify-content: space-between; padding-top: 8px; font-size: .9rem; color: var(--mute);">
      <span>Phụ phí cơ sở (FEE0)</span>
      <span>${FEE0.toLocaleString('vi-VN')} ₫</span>
    </div>
    <button id="btn-sync-tuyen" class="btn-sm solid" style="width: 100%; margin-top: 16px; display: flex; justify-content: center; align-items: center; gap: 8px;">
      <i class="fa-solid fa-arrows-rotate"></i> Đồng bộ dữ liệu với Tuyền
    </button>
  `;

  return `
    <section class="card" id="tuyen-sync-card">
      <div class="card-h">
        <h3><i class="fa-solid fa-file-invoice-dollar"></i> Đồng bộ phí khóa học</h3>
        <span class="count">${reg.length} môn</span>
      </div>
      <div class="card-b">
        <ul style="list-style: none; padding: 0; margin: 0;">
          ${courseRows || '<p class="empty">Chưa có dữ liệu môn học để đồng bộ.</p>'}
        </ul>
        ${reg.length ? totalDisplay : ''}
      </div>
    </section>
  `;
}

function handleSyncTuyenData(regData) {
  const btn = document.querySelector('#btn-sync-tuyen');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang đồng bộ...';
    btn.style.opacity = '0.7';

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const toastMsg = document.getElementById('toast-msg');
      if (toastMsg) {
        toastMsg.textContent = '✅ Đã đồng bộ chi tiết phí khóa học thành công!';
        document.getElementById('toast').classList.remove('hidden');
        setTimeout(() => document.getElementById('toast').classList.add('hidden'), 3000);
      } else {
        alert('Đã đồng bộ thành công!');
      }
    } catch (error) {
      alert('Lỗi đồng bộ dữ liệu: ' + error.message);
    } finally {
      btn.innerHTML = '<i class="fa-solid fa-arrows-rotate"></i> Đồng bộ dữ liệu với Tuyền';
      btn.style.opacity = '1';
    }
  });
}