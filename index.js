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

  /* ---------- Dữ liệu: dùng script.js nếu có, nếu không vẫn chạy được ---------- */
  const HAS_CORE = typeof MOCK_COURSES !== 'undefined';
  const COURSES = HAS_CORE ? MOCK_COURSES : [];
  const PT = typeof PERIOD_TIMES !== 'undefined' ? PERIOD_TIMES
    : Array.from({ length: 12 }, (_, i) => ({ period: i + 1, start: String(7 + i).padStart(2, '0') + ':00', end: String(7 + i).padStart(2, '0') + ':50' }));
  const PRICE = typeof CREDIT_PRICE !== 'undefined' ? CREDIT_PRICE : 500000;
  const read = (store, key, def) => { try { const r = store.getItem(key); return r ? JSON.parse(r) : def; } catch (e) { return def; } };
  const DEFAULT_NEWS = [
    { id: 1, title: 'Hạn đăng ký môn học: 15/10/2026', desc: 'Hệ thống đăng ký môn HK1 sẽ đóng vào 23:59 ngày 15/10. Vui lòng hoàn tất đăng ký.', time: '10 phút trước', type: 'urgent', icon: 'fa-triangle-exclamation', unread: true, link: 'courses.html' },
    { id: 2, title: 'Nhắc nhở học phí HK1 – 2025/2026', desc: 'Hạn nộp học phí trước ngày 15/10/2026. Kiểm tra chi tiết trong mục Học phí.', time: '2 giờ trước', type: 'warning', icon: 'fa-receipt', unread: true, link: 'tuition.html' },
    { id: 3, title: 'Lịch thi giữa kỳ đã cập nhật', desc: 'Đã có lịch thi các môn chuyên ngành trên cổng thời khóa biểu.', time: '1 ngày trước', type: 'info', icon: 'fa-calendar-days', unread: true, link: 'schedule.html' },
    { id: 4, title: 'Học bổng khuyến học đợt 2 mở nộp đơn', desc: 'Sinh viên có GPA ≥ 3.2 có thể nộp hồ sơ xét học bổng khuyến học đến 20/10/2026.', time: '2 ngày trước', type: 'success', icon: 'fa-award', unread: true, link: 'home.html' }
  ];
  const getNews = () => read(localStorage, 'sc_notifications', null) || DEFAULT_NEWS.map(x => ({ ...x }));
  const setNews = (l) => { try { localStorage.setItem('sc_notifications', JSON.stringify(l)); } catch (e) { } };
  const toast = (m) => { if (typeof showToast === 'function') showToast(m); };
  const getU = () => read(sessionStorage, 'sc_user', null);
  const getReg = () => read(localStorage, 'sc_registered', []);

  /* ---------- Hằng số & dữ liệu ---------- */
  const DEADLINE = new Date(2026, 9, 15, 23, 59, 59); // đổi hạn đăng ký tại đây
  const MAX = 21, GRAD = 130, FEE0 = 150000;
  const DAYS = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  const user = getU(), now = new Date();
  let role = user && localStorage.getItem('sc_role') === 'teacher' ? 'teacher' : 'student';
  const toMin = (t) => { const [h, m] = t.split(':'); return +h * 60 + +m; };
  const per = (p) => PT.find(x => x.period === p);
  const slot = (c) => ({ s: per(c.periods[0]).start, e: per(c.periods[c.periods.length - 1]).end });

  /* ---------- Tài khoản: đăng nhập / đã đăng nhập ---------- */
  if (user) {
    const p = user.name.trim().split(' ');
    const ini = (p.length > 1 ? p[0][0] + p[p.length - 1][0] : user.name.slice(0, 2)).toUpperCase();
    $('#guest').classList.add('hidden'); $('#user').classList.remove('hidden');
    $('#side-user').classList.remove('hidden'); $('#side-logout').classList.remove('hidden');
    ['#me-av', '#side-av'].forEach(s => $(s).textContent = ini);
    $('#me-short').textContent = p[p.length - 1];
    ['#me-name', '#side-name'].forEach(s => $(s).textContent = user.name);
    ['#me-id', '#side-id'].forEach(s => $(s).textContent = user.mssv);
  }
  document.querySelectorAll('.js-logout').forEach(b => b.addEventListener('click', () => {
    sessionStorage.clear(); localStorage.removeItem('sc_cart'); localStorage.removeItem('sc_registered');
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
  const seg = () => user ? `<div class="seg" id="seg"><button type="button" data-role="student" class="${role === 'student' ? 'on' : ''}"><i class="fa-solid fa-user-graduate"></i> Sinh viên</button><button type="button" data-role="teacher" class="${role === 'teacher' ? 'on' : ''}"><i class="fa-solid fa-chalkboard-user"></i> Giảng viên</button></div>` : '';
  const banner = (h1, sub, actions, pill, side) => `<section class="banner"><div>${seg()}<h1>${h1}</h1><p>${sub}</p><div class="bn-act">${actions}</div>${pill || ''}</div></section>`;

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
  const greeting = () => { const h = now.getHours(); return h < 11 ? 'Chào buổi sáng ☀️' : h < 14 ? 'Chào buổi trưa 🌤️' : h < 18 ? 'Chào buổi chiều 🌇' : 'Chào buổi tối 🌙'; };
  const lastName = () => esc(user.name.trim().split(' ').pop());

  /* ---------- Khách (chưa đăng nhập) ---------- */
  function guest() {
    const classes = COURSES.reduce((s, c) => s + c.classes.length, 0);
    $('#banner').innerHTML = banner('Chào mừng đến với SmartCourse LHU 👋',
      'Cổng đăng ký môn học thông minh: chọn môn, xếp lịch học và theo dõi học phí chỉ trong vài bước.',
      '<a class="bn-btn w" href="index.html"><i class="fa-solid fa-right-to-bracket"></i> Đăng nhập</a><a class="bn-btn g" href="register.html"><i class="fa-solid fa-user-plus"></i> Tạo tài khoản</a>');
    $('#stats').innerHTML = stat('courses.html', '#0d9488', 'fa-book-open', COURSES.length, 'Môn học đang mở') +
      stat('courses.html', '#22c55e', 'fa-people-group', classes, 'Lớp học phần') +
      stat('home.html', '#0ea5e9', 'fa-layer-group', MAX, 'Tín chỉ tối đa mỗi học kỳ') +
      stat('tuition.html', '#ff9f1c', 'fa-coins', vnd(PRICE), 'Học phí mỗi tín chỉ');
    const how = [['Đăng nhập', 'Dùng mã số sinh viên hoặc tài khoản giảng viên'], ['Chọn môn & lớp', 'Hệ thống tự kiểm tra trùng lịch và giới hạn tín chỉ'],
    ['Xem thời khóa biểu', 'Lịch tuần hiển thị trực quan, có phòng học'], ['Đóng học phí', 'Theo dõi số tiền và hạn nộp']];
    const open = COURSES.slice(0, 6).map(c => {
      const left = c.classes.reduce((s, x) => s + x.max - x.enrolled, 0);
      return `<li><span class="dot" style="background:${c.color}"></span><div><b>${c.name}</b><small>${c.code} · ${c.classes.length} lớp · còn ${left} chỗ</small></div><span class="tc">${c.credits} TC</span></li>`;
    }).join('');
    $('#two').innerHTML = card('route', 'Đăng ký chỉ với 4 bước', '', `<ol class="steps">${how.map((s, i) => `<li><span class="n">${i + 1}</span><div><b>${s[0]}</b><small>${s[1]}</small></div></li>`).join('')}</ol>`) +
      card('fire', 'Môn học đang mở', '<a href="index.html">Đăng nhập để đăng ký →</a>', `<ul class="list">${open}</ul>`);
    $('#extra').innerHTML = '';
  }

  /* ---------- Sinh viên ---------- */
  function student() {
    const reg = getReg().map(r => {
      const c = COURSES.find(x => x.id === r.courseId);
      return { c, cl: c && c.classes.find(x => x.id === r.classId) };
    }).filter(r => r.cl);
    const n = reg.length, tc = reg.reduce((s, r) => s + r.c.credits, 0);
    const fee = n ? tc * PRICE + FEE0 : 0, paid = localStorage.getItem('sc_paid') === '1';
    const items = reg.map(r => ({ day: r.cl.day, name: r.c.name, color: r.c.color, room: r.cl.room, credits: r.c.credits, ...slot(r.cl) }));
    const diff = DEADLINE - now;
    const pill = diff > 0
      ? `<span class="pill"><i class="fa-solid fa-hourglass-half"></i> Còn ${Math.ceil(diff / 864e5)} ngày đến hạn đăng ký (15/10/2026)</span>`
      : '<span class="pill late"><i class="fa-solid fa-triangle-exclamation"></i> Đã qua hạn đăng ký 15/10/2026 – liên hệ phòng Đào tạo nếu cần hỗ trợ</span>';
    $('#banner').innerHTML = banner(`${greeting()}, ${lastName()}!`, `${esc(user.majorName)} · Năm ${user.year} · Học kỳ 1 – 2025/2026`,
      '<a class="bn-btn w" href="courses.html"><i class="fa-solid fa-wand-magic-sparkles"></i> Đăng ký môn học</a><a class="bn-btn g" href="schedule.html"><i class="fa-solid fa-calendar-week"></i> Thời khóa biểu</a>', pill, nextCard(items));

    const total = user.totalCredits + tc, pct = Math.min(100, Math.round(total / GRAD * 100));
    $('#stats').innerHTML = stat('courses.html', '#0d9488', 'fa-book-open', n, 'Môn đã đăng ký') + stat('courses.html', '#22c55e', 'fa-circle-check', tc, 'Tín chỉ học kỳ này') +
      stat('home.html', '#0ea5e9', 'fa-chart-line', total, 'Tổng tín chỉ tích lũy') + stat('tuition.html', '#ff9f1c', 'fa-coins', vnd(fee), paid ? 'Học phí · đã thanh toán' : 'Học phí học kỳ');

    const ring = `<div class="prog"><div class="ring-wrap"><svg class="ring" viewBox="0 0 100 100"><circle class="bg" cx="50" cy="50" r="42"/><circle class="fg" cx="50" cy="50" r="42" pathLength="100" stroke-dasharray="${pct} 100"/></svg>
      <div class="ring-lb"><b>${pct}%</b><small>hoàn thành</small></div></div>
      <div class="prog-d"><div><span>Đã tích lũy</span><b>${total} / ${GRAD} TC</b></div><div class="bar"><i style="width:${pct}%"></i></div><div><span>Cần thêm</span><b>${Math.max(0, GRAD - total)} TC</b></div></div></div>`;
    const courses = n ? `<ul class="list">${items.map(i => `<li><span class="dot" style="background:${i.color}"></span><div><b>${i.name}</b><small>${i.day} · ${i.s} – ${i.e} · ${i.room}</small></div><span class="tc">${i.credits} TC</span></li>`).join('')}</ul>`
      : '<p class="empty">Chưa đăng ký môn nào. <a href="courses.html">Đăng ký ngay →</a></p>';
    $('#two').innerHTML = card('chart-pie', 'Tiến độ tốt nghiệp', '', ring) + card('list-check', 'Môn học kỳ này', '<a href="courses.html">Xem thêm →</a>', courses);

    const ids = getReg().map(r => r.courseId), sg = [];
    if (!n) sg.push(['#0d9488', 'fa-rocket', 'Bắt đầu với môn bắt buộc', 'Còn chỗ: ' + COURSES.filter(c => c.type === 'Bắt buộc' && c.classes.some(x => x.enrolled < x.max)).slice(0, 3).map(c => c.name).join(', ') + '.', 'courses.html']);
    else if (tc < MAX) sg.push(['#0d9488', 'fa-circle-plus', `Còn ${MAX - tc} TC có thể đăng ký`, 'Thêm môn tự chọn để đủ tải học tập.', 'courses.html']);
    const hot = COURSES.filter(c => !ids.includes(c.id)).filter(c => { const l = Math.max(...c.classes.map(x => x.max - x.enrolled)); return l > 0 && l <= 5; }).map(c => c.name);
    if (hot.length) sg.push(['#ff5a4f', 'fa-fire', 'Sắp hết chỗ!', hot.join(', ') + ' chỉ còn vài suất.', 'courses.html']);
    if (n && !paid) sg.push(['#ff9f1c', 'fa-wallet', 'Học phí chưa thanh toán', `Cần đóng ${vnd(fee)} trước hạn 15/10/2026.`, 'tuition.html']);
    if (n && paid) sg.push(['#22c55e', 'fa-circle-check', 'Mọi thứ đã sẵn sàng', 'Bạn đã đăng ký và đóng học phí. Chúc học kỳ thành công!', 'schedule.html']);
    $('#extra').innerHTML = card('lightbulb', 'Gợi ý thông minh cho bạn', '', `<div class="sugg">${sg.map(s => `<a class="sg" href="${s[4]}" style="--c:${s[0]}"><i class="fa-solid ${s[1]}"></i><div><b>${s[2]}</b><span>${s[3]}</span></div></a>`).join('')}</div>`);
    $('#extra').innerHTML += renderTuitionSyncBox(reg);
    handleSyncTuyenData(reg);
  }

  /* ---------- Giảng viên ---------- */
  function teacher() {
    const all = [];
    COURSES.forEach(c => c.classes.forEach(cl => all.push({ c, cl })));
    const names = [...new Set(all.map(x => x.cl.teacher))].filter(t => t !== 'Nhiều giảng viên').sort((a, b) => a.localeCompare(b, 'vi'));
    const saved = localStorage.getItem('sc_teacher'), sel = names.includes(saved) ? saved : names[0];
    const mine = all.filter(x => x.cl.teacher === sel);
    const items = mine.map(({ c, cl }) => ({ day: cl.day, name: `${c.name} · ${cl.id}`, color: c.color, room: cl.room, ...slot(cl) }));
    $('#banner').innerHTML = banner('Xin chào quý thầy cô! 👩‍🏫', 'Theo dõi lớp phụ trách, sĩ số và lịch giảng dạy của bạn trong một màn hình.',
      '<a class="bn-btn w" href="schedule.html"><i class="fa-solid fa-calendar-week"></i> Lịch giảng dạy</a><a class="bn-btn g" href="settings.html"><i class="fa-solid fa-user-gear"></i> Hồ sơ</a>', '', nextCard(items));
    $('#stats').innerHTML = stat('schedule.html', '#0d9488', 'fa-people-group', mine.length, 'Lớp phụ trách') + stat('schedule.html', '#22c55e', 'fa-user-graduate', mine.reduce((s, x) => s + x.cl.enrolled, 0), 'Tổng sinh viên') +
      stat('schedule.html', '#0ea5e9', 'fa-clock', mine.reduce((s, x) => s + x.cl.periods.length, 0), 'Tiết dạy mỗi tuần') + stat('courses.html', '#ff9f1c', 'fa-book', new Set(mine.map(x => x.c.id)).size, 'Môn giảng dạy');
    $('#two').innerHTML = card('chalkboard-user', 'Giảng viên', '', `<select id="t-sel">${names.map(x => `<option ${x === sel ? 'selected' : ''}>${x}</option>`).join('')}</select><p class="empty">Dữ liệu minh họa lấy từ danh mục môn học. Chọn giảng viên để xem lớp phụ trách.</p>`) +
      card('list-check', 'Lớp phụ trách', '<a href="courses.html">Danh mục môn →</a>', `<ul class="list">${mine.map(({ c, cl }) => {
        const p = Math.round(cl.enrolled / cl.max * 100);
        return `<li><span class="dot" style="background:${c.color}"></span><div><b>${c.name} · ${cl.id}</b><small>${cl.day} · ${slot(cl).s} – ${slot(cl).e} · ${cl.room}</small><div class="bar" style="margin-top:6px"><i style="width:${p}%"></i></div></div><span class="tc">${cl.enrolled}/${cl.max}</span></li>`;
      }).join('')}</ul>`);
    $('#extra').innerHTML = '';
    $('#t-sel').addEventListener('change', (e) => { localStorage.setItem('sc_teacher', e.target.value); render(); });
  }

  /* ---------- Khởi chạy ---------- */
  function render() { !user ? guest() : role === 'teacher' ? teacher() : student(); }
  $('#content').addEventListener('click', (e) => {
    const b = e.target.closest('#seg button'); if (!b) return;
    role = b.dataset.role; localStorage.setItem('sc_role', role); render();
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