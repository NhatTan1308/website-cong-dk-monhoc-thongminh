document.addEventListener('DOMContentLoaded', () => {
  const $ = (selector) => document.querySelector(selector);
  const DAYS = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  const PERIODS = [
    ['07:00', '07:50'], ['07:50', '08:40'], ['08:40', '09:30'],
    ['09:50', '10:40'], ['10:40', '11:30'], ['11:30', '12:20'],
    ['13:00', '13:50'], ['13:50', '14:40'], ['14:40', '15:30'],
    ['15:50', '16:40'], ['16:40', '17:30'], ['17:30', '18:20']
  ];
  const COURSES = [
    { code: 'OOP201', name: 'Lập trình hướng đối tượng', credits: 4, day: 0, start: 1, end: 3, room: 'Phòng A203', teacher: 'ThS. Phạm Văn I', color: '#0d9488' },
    { code: 'DB101', name: 'Hệ quản trị cơ sở dữ liệu', credits: 3, day: 1, start: 4, end: 6, room: 'Phòng B105', teacher: 'TS. Nguyễn Thị Như Quỳnh', color: '#0ea5e9' },
    { code: 'DS102', name: 'Cấu trúc dữ liệu nâng cao', credits: 3, day: 2, start: 1, end: 3, room: 'Phòng A302', teacher: 'ThS. Phạm C', color: '#8b5cf6' },
    { code: 'NT201', name: 'Mạng máy tính cơ bản', credits: 3, day: 3, start: 7, end: 9, room: 'Phòng Lab 2', teacher: 'ThS. Lê Văn A', color: '#f59e0b' },
    { code: 'PR202', name: 'Lập trình Web nâng cao', credits: 4, day: 4, start: 9, end: 11, room: 'Phòng C201', teacher: 'ThS. Nguyễn E', color: '#ef6472' }
  ];

  const dateAtMidnight = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const mondayOf = (date) => {
    const monday = dateAtMidnight(date);
    monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
    return monday;
  };
  const formatDate = (date, options) => new Intl.DateTimeFormat('vi-VN', options).format(date);
  const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
  const getClassTimes = (course) => ({
    start: PERIODS[course.start - 1][0],
    end: PERIODS[course.end - 1][1]
  });
  const today = dateAtMidnight(new Date());
  let weekStart = mondayOf(today);

  function renderSummary() {
    $('#course-count').textContent = COURSES.length;
    $('#credit-count').textContent = COURSES.reduce((total, course) => total + course.credits, 0);
    $('#period-count').textContent = COURSES.reduce((total, course) => total + course.end - course.start + 1, 0);
    $('#study-day-count').textContent = new Set(COURSES.map((course) => course.day)).size;
  }

  function renderWeek() {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 5);
    $('#week-range').textContent = `${formatDate(weekStart, { day: '2-digit', month: '2-digit' })} – ${formatDate(weekEnd, { day: '2-digit', month: '2-digit', year: 'numeric' })}`;

    const cells = ['<div class="board-cell board-corner">Tiết</div>'];
    DAYS.forEach((day, index) => {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + index);
      const isToday = date.getTime() === today.getTime();
      cells.push(`<div class="board-cell board-day${isToday ? ' is-today' : ''}">${day}<small>${formatDate(date, { day: '2-digit', month: '2-digit' })}</small></div>`);
    });

    PERIODS.forEach(([start, end], index) => {
      const period = index + 1;
      cells.push(`<div class="board-cell board-time"><strong>Tiết ${period}</strong><small>${start}–${end}</small></div>`);
      DAYS.forEach(() => cells.push('<div class="board-cell board-slot" aria-hidden="true"></div>'));
    });

    const classes = COURSES.map((course) => {
      const times = getClassTimes(course);
      const safeName = escapeHTML(course.name);
      const safeCode = escapeHTML(course.code);
      const safeRoom = escapeHTML(course.room);
      const safeTeacher = escapeHTML(course.teacher);
      return `<article class="schedule-class" style="--class-color:${course.color};grid-column:${course.day + 2};grid-row:${course.start + 1}/${course.end + 2}" aria-label="${safeName}, ${DAYS[course.day]}, ${times.start} đến ${times.end}, ${safeRoom}">
        <strong>${safeCode}</strong>
        <span class="class-name">${safeName}</span>
        <span><i class="fa-regular fa-clock"></i>${times.start}–${times.end}</span>
        <span><i class="fa-solid fa-location-dot"></i>${safeRoom}</span>
        <span><i class="fa-solid fa-user"></i>${safeTeacher}</span>
      </article>`;
    });

    $('#schedule-board').innerHTML = cells.join('') + classes.join('');
  }

  function renderToday() {
    const dayIndex = (today.getDay() + 6) % 7;
    $('#today-date').textContent = formatDate(today, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const lessons = COURSES
      .filter((course) => course.day === dayIndex)
      .sort((first, second) => first.start - second.start);

    if (!lessons.length) {
      $('#today-list').innerHTML = '<p class="empty-day"><i class="fa-regular fa-calendar"></i> Hôm nay bạn không có tiết học theo lịch minh họa.</p>';
      return;
    }

    $('#today-list').innerHTML = lessons.map((course) => {
      const times = getClassTimes(course);
      return `<article class="today-item" style="--class-color:${course.color}">
        <span class="today-time">${times.start} – ${times.end}</span>
        <span><strong>${escapeHTML(course.name)}</strong><small>${escapeHTML(course.code)} · ${escapeHTML(course.teacher)}</small></span>
        <span class="today-room"><i class="fa-solid fa-location-dot"></i> ${escapeHTML(course.room)}</span>
      </article>`;
    }).join('');
  }

  const setTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    $('#mode-btn').innerHTML = `<i class="fa-solid fa-${theme === 'dark' ? 'sun' : 'moon'}"></i>`;
    $('#mode-btn').title = theme === 'dark' ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối';
  };

  setTheme(document.documentElement.dataset.theme || 'light');
  $('#mode-btn').addEventListener('click', () => {
    const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem('sc_theme', theme);
    } catch (error) {
      console.warn('Không thể lưu tùy chọn giao diện.', error);
    }
    setTheme(theme);
  });

  $('#previous-week').addEventListener('click', () => {
    weekStart.setDate(weekStart.getDate() - 7);
    renderWeek();
  });
  $('#next-week').addEventListener('click', () => {
    weekStart.setDate(weekStart.getDate() + 7);
    renderWeek();
  });
  $('#today-button').addEventListener('click', () => {
    weekStart = mondayOf(today);
    renderWeek();
  });
  $('#print-schedule').addEventListener('click', () => window.print());

  const side = $('#side');
  const overlay = $('#overlay');
  const toggleSide = (open) => {
    side.classList.toggle('open', open);
    overlay.classList.toggle('show', open);
  };
  $('#menu').addEventListener('click', () => toggleSide(!side.classList.contains('open')));
  overlay.addEventListener('click', () => toggleSide(false));

  renderSummary();
  renderWeek();
  renderToday();
});