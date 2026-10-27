document.addEventListener('DOMContentLoaded', () => {
  const $ = (selector) => document.querySelector(selector);
  const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
  let user = null;
  try {
    user = JSON.parse(sessionStorage.getItem('sc_user') || 'null');
  } catch (error) {
    console.error('Không thể đọc phiên đăng nhập:', error);
  }
  if (user && typeof user.name === 'string' && user.name.trim()) {
    const name = user.name.trim();
    const parts = name.split(/\s+/);
    const initials = (parts.length > 1
      ? parts[0][0] + parts[parts.length - 1][0]
      : name.slice(0, 2)).toUpperCase();
    $('#schedule-login').classList.add('hidden');
    $('#user').classList.remove('hidden');
    $('#side-user').classList.remove('hidden');
    $('#side-logout').classList.remove('hidden');
    ['#me-av', '#side-av'].forEach((selector) => {
      const avatar = $(selector);
      if (typeof user.avatar === 'string' && user.avatar.startsWith('data:image/')) {
        const image = document.createElement('img');
        image.src = user.avatar;
        image.alt = '';
        image.className = 'avatar-image';
        avatar.replaceChildren(image);
      } else {
        avatar.textContent = initials;
      }
    });
    $('#side-name').textContent = name;
    $('#side-id').textContent = user.mssv || '';
    $('#me-short').textContent = parts[parts.length - 1];
    $('#me-name').textContent = name;
    $('#me-id').textContent = user.mssv || '';
  }
  document.querySelectorAll('.js-logout').forEach((button) => {
    button.addEventListener('click', () => {
      sessionStorage.removeItem('sc_user');
      localStorage.removeItem('sc_cart');
      window.location.href = '../index.html';
    });
  });
  const accountButton = $('#me-btn');
  const accountMenu = $('#me-pop');
  accountButton.addEventListener('click', (event) => {
    event.stopPropagation();
    $('#notif-pop').classList.add('hidden');
    $('#notif-btn').setAttribute('aria-expanded', 'false');
    const isOpen = accountMenu.classList.toggle('hidden') === false;
    accountButton.setAttribute('aria-expanded', String(isOpen));
  });
  const notificationButton = $('#notif-btn');
  const notificationMenu = $('#notif-pop');
  const defaultNotifications = [
    { id: 1, title: 'Hạn đăng ký môn học: 15/10/2026', desc: 'Hệ thống đăng ký môn HK1 sẽ đóng vào 23:59 ngày 15/10. Vui lòng hoàn tất đăng ký.', time: '10 phút trước', type: 'urgent', icon: 'fa-triangle-exclamation', unread: true, link: '../Courses/courses.html' },
    { id: 2, title: 'Nhắc nhở học phí HK1 – 2025/2026', desc: 'Hạn nộp học phí trước ngày 15/10/2026. Kiểm tra chi tiết trong mục Học phí.', time: '2 giờ trước', type: 'warning', icon: 'fa-receipt', unread: true, link: '../Tuition/tuition.html' },
    { id: 3, title: 'Lịch thi giữa kỳ đã cập nhật', desc: 'Đã có lịch thi các môn chuyên ngành trên cổng thời khóa biểu.', time: '1 ngày trước', type: 'info', icon: 'fa-calendar-days', unread: true, link: 'Schedule.html' },
    { id: 4, title: 'Học bổng khuyến học đợt 2 mở nộp đơn', desc: 'Sinh viên có GPA ≥ 3.2 có thể nộp hồ sơ xét học bổng khuyến học đến 20/10/2026.', time: '2 ngày trước', type: 'success', icon: 'fa-award', unread: true, link: '../index.html' }
  ];
  const getNotifications = () => {
    try {
      const saved = localStorage.getItem('sc_notifications');
      if (saved === null) return defaultNotifications.map((item) => ({ ...item }));
      const notifications = JSON.parse(saved);
      if (!Array.isArray(notifications)) throw new Error('Dữ liệu thông báo không hợp lệ.');
      return notifications;
    } catch (error) {
      console.error('Không thể đọc thông báo.', error);
      return defaultNotifications.map((item) => ({ ...item }));
    }
  };
  const saveNotifications = (notifications) => {
    try {
      localStorage.setItem('sc_notifications', JSON.stringify(notifications));
    } catch (error) {
      console.error('Không thể lưu trạng thái thông báo.', error);
    }
  };
  const renderNotifications = () => {
    const notifications = getNotifications();
    const unreadCount = notifications.filter((item) => item.unread).length;
    const badge = $('#notif-n');
    badge.textContent = unreadCount > 99 ? '99+' : String(unreadCount);
    badge.classList.toggle('hidden', unreadCount === 0);
    $('#notif-list').innerHTML = notifications.map((item) => `
      <a class="nitem ${item.unread ? 'unread' : ''}" href="${escapeHTML(item.link || '#')}" data-id="${escapeHTML(item.id)}">
        <span class="ni ${escapeHTML(item.type || 'info')}"><i class="fa-solid ${escapeHTML(item.icon || 'fa-bell')}"></i></span>
        <span><b>${escapeHTML(item.title || 'Thông báo')}</b><small>${escapeHTML(item.desc || '')}</small><em>${escapeHTML(item.time || '')}</em></span>
      </a>`).join('');
  };
  notificationButton.addEventListener('click', (event) => {
    event.stopPropagation();
    accountMenu.classList.add('hidden');
    accountButton.setAttribute('aria-expanded', 'false');
    const isOpen = notificationMenu.classList.toggle('hidden') === false;
    notificationButton.setAttribute('aria-expanded', String(isOpen));
  });
  $('#notif-all').addEventListener('click', (event) => {
    event.stopPropagation();
    saveNotifications(getNotifications().map((item) => ({ ...item, unread: false })));
    renderNotifications();
  });
  $('#notif-list').addEventListener('click', (event) => {
    const notification = event.target.closest('.nitem');
    if (!notification) return;
    const notifications = getNotifications();
    const selected = notifications.find((item) => String(item.id) === notification.dataset.id);
    if (!selected || !selected.unread) return;
    selected.unread = false;
    saveNotifications(notifications);
    renderNotifications();
  });
  document.addEventListener('click', (event) => {
    if (!accountMenu.contains(event.target) && !accountButton.contains(event.target)) {
      accountMenu.classList.add('hidden');
      accountButton.setAttribute('aria-expanded', 'false');
    }
    if (!notificationMenu.contains(event.target) && !notificationButton.contains(event.target)) {
      notificationMenu.classList.add('hidden');
      notificationButton.setAttribute('aria-expanded', 'false');
    }
  });
  renderNotifications();

  const DAYS = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  const PERIODS = [
    ['07:00', '07:50'], ['07:50', '08:40'], ['08:40', '09:30'],
    ['09:50', '10:40'], ['10:40', '11:30'], ['11:30', '12:20'],
    ['13:00', '13:50'], ['13:50', '14:40'], ['14:40', '15:30'],
    ['15:50', '16:40'], ['16:40', '17:30'], ['17:30', '18:20']
  ];
  const COLORS = ['#0d9488', '#0ea5e9', '#8b5cf6', '#f59e0b', '#ef6472', '#22c55e'];
  const dateAtMidnight = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const mondayOf = (date) => {
    const monday = dateAtMidnight(date);
    monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
    return monday;
  };
  const formatDate = (date, options) => new Intl.DateTimeFormat('vi-VN', options).format(date);
  const getClassTimes = (section) => ({
    start: PERIODS[section.start - 1][0],
    end: PERIODS[section.end - 1][1]
  });
  const today = dateAtMidnight(new Date());
  let weekStart = mondayOf(today);
  let registeredCourses = [];
  let plan = new Map();
  let aiMode = false;
  let scheduleMessage = '';
  try {
    aiMode = getStudentStorageItem('sc_schedule_mode') === 'ai';
  } catch (error) {
    console.warn('Không thể đọc chế độ xếp lịch.', error);
  }

  function loadConfirmedCourses() {
    return getConfirmedCourses();
  }

  function loadSavedPlan(courses) {
    const savedPlan = (() => {
      try {
        const value = getStudentStorageItem('sc_schedule_plan');
        return value ? JSON.parse(value) : {};
      } catch (error) {
        console.warn('Không thể đọc thời khóa biểu đã lưu.', error);
        return {};
      }
    })();
    const result = new Map();
    courses.forEach((course) => {
      const options = DEMO_CLASS_OPTIONS.get(course.id) || [];
      const selection = Number(savedPlan && savedPlan[course.id]);
      result.set(course.id, Number.isInteger(selection) && options[selection] ? selection : 0);
    });
    return result;
  }

  function savePlan(nextPlan) {
    const serializable = Object.fromEntries(nextPlan);
    try {
      setStudentStorageItem('sc_schedule_plan', JSON.stringify(serializable));
      plan = nextPlan;
    } catch (error) {
      console.error('Không thể lưu thời khóa biểu.', error);
      scheduleMessage = 'Không thể lưu lịch trên thiết bị này. Hãy kiểm tra quyền truy cập bộ nhớ trình duyệt.';
    }
  }

  function saveMode() {
    try {
      setStudentStorageItem('sc_schedule_mode', aiMode ? 'ai' : 'manual');
    } catch (error) {
      console.warn('Không thể lưu chế độ xếp lịch.', error);
    }
  }

  function getScheduledCourses() {
    return registeredCourses.map((course, index) => {
      const options = DEMO_CLASS_OPTIONS.get(course.id) || [];
      const sectionIndex = plan.get(course.id) || 0;
      const section = options[sectionIndex];
      return section ? { ...course, ...section, color: COLORS[index % COLORS.length] } : null;
    }).filter(Boolean);
  }

  function scoreState(state) {
    let activeDays = 0;
    let gaps = 0;
    state.masks.forEach((mask) => {
      if (!mask) return;
      activeDays += 1;
      let first = 12;
      let last = -1;
      let occupied = 0;
      for (let period = 0; period < 12; period += 1) {
        if (mask & (1 << period)) {
          first = Math.min(first, period);
          last = period;
          occupied += 1;
        }
      }
      gaps += last - first + 1 - occupied;
    });
    const totalEnd = state.assignments.reduce((sum, item) => sum + item.section.end, 0);
    const totalStart = state.assignments.reduce((sum, item) => sum + item.section.start, 0);
    return [activeDays, gaps, totalEnd, totalStart];
  }

  function compareStates(first, second) {
    const firstScore = scoreState(first);
    const secondScore = scoreState(second);
    for (let index = 0; index < firstScore.length; index += 1) {
      if (firstScore[index] !== secondScore[index]) return firstScore[index] - secondScore[index];
    }
    return 0;
  }

  function recommendSchedule(courses) {
    const orderedCourses = [...courses].sort((first, second) => {
      const firstOptions = (DEMO_CLASS_OPTIONS.get(first.id) || []).length;
      const secondOptions = (DEMO_CLASS_OPTIONS.get(second.id) || []).length;
      return firstOptions - secondOptions || second.credits - first.credits || first.id - second.id;
    });
    let candidates = [{ assignments: [], masks: Array(6).fill(0) }];

    for (const course of orderedCourses) {
      const options = DEMO_CLASS_OPTIONS.get(course.id) || [];
      const nextCandidates = [];
      for (const candidate of candidates) {
        options.forEach((section, sectionIndex) => {
          let sectionMask = 0;
          for (let period = section.start; period <= section.end; period += 1) {
            sectionMask |= 1 << (period - 1);
          }
          if (candidate.masks[section.day] & sectionMask) return;
          const masks = [...candidate.masks];
          masks[section.day] |= sectionMask;
          nextCandidates.push({
            assignments: [...candidate.assignments, { course, section, sectionIndex }],
            masks
          });
        });
      }
      if (!nextCandidates.length) return null;
      candidates = nextCandidates.sort(compareStates).slice(0, 256);
    }

    return new Map(candidates[0].assignments.map(({ course, sectionIndex }) => [course.id, sectionIndex]));
  }

  function renderSummary(scheduledCourses) {
    const credits = registeredCourses.reduce((total, course) => total + Number(course.credits || 0), 0);
    const periods = scheduledCourses.reduce((total, course) => total + course.end - course.start + 1, 0);
    const studyDays = new Set(scheduledCourses.map((course) => course.day)).size;
    const courseFee = credits * (typeof CREDIT_PRICE === 'number' ? CREDIT_PRICE : 500000);
    const baseFee = registeredCourses.length
      ? (typeof BASE_FEE === 'number' ? BASE_FEE : 150000)
      : 0;
    $('#course-count').textContent = registeredCourses.length;
    $('#credit-count').textContent = credits;
    $('#period-count').textContent = periods;
    $('#study-day-count').textContent = studyDays;
    $('#tuition-estimate').textContent = `${(courseFee + baseFee).toLocaleString('vi-VN')} ₫`;
  }

  function renderWeek(scheduledCourses) {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 5);
    $('#week-range').textContent = `${formatDate(weekStart, { day: '2-digit', month: '2-digit' })} – ${formatDate(weekEnd, { day: '2-digit', month: '2-digit', year: 'numeric' })}`;

    const cells = ['<div class="board-cell board-corner" style="grid-column:1;grid-row:1">Tiết</div>'];
    DAYS.forEach((day, index) => {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + index);
      const isToday = date.getTime() === today.getTime();
      cells.push(`<div class="board-cell board-day${isToday ? ' is-today' : ''}" style="grid-column:${index + 2};grid-row:1">${day}<small>${formatDate(date, { day: '2-digit', month: '2-digit' })}</small></div>`);
    });

    PERIODS.forEach(([start, end], index) => {
      const period = index + 1;
      cells.push(`<div class="board-cell board-time" style="grid-column:1;grid-row:${period + 1}"><strong>Tiết ${period}</strong><small>${start}–${end}</small></div>`);
      DAYS.forEach((_, dayIndex) => {
        cells.push(`<div class="board-cell board-slot" style="grid-column:${dayIndex + 2};grid-row:${period + 1}" aria-hidden="true"></div>`);
      });
    });

    const classes = scheduledCourses.map((course) => {
      const times = getClassTimes(course);
      const safeName = escapeHTML(course.name);
      const safeCode = escapeHTML(course.code);
      const safeRoom = escapeHTML(`Phòng ${course.room}`);
      const safeTeacher = escapeHTML(course.teacher);
      return `<article class="schedule-class" style="--class-color:${course.color};grid-column:${course.day + 2};grid-row:${course.start + 1}/${course.end + 2}" aria-label="${safeName}, ${DAYS[course.day]}, ${times.start} đến ${times.end}, ${safeRoom}">
        <strong>${safeCode} · Lớp ${course.section}</strong>
        <span class="class-name">${safeName}</span>
        <span><i class="fa-regular fa-clock"></i>${times.start}–${times.end}</span>
        <span><i class="fa-solid fa-location-dot"></i>${safeRoom}</span>
        <span><i class="fa-solid fa-user"></i>${safeTeacher}</span>
      </article>`;
    });

    $('#schedule-board').innerHTML = cells.join('') + classes.join('');
  }

  function renderToday(scheduledCourses) {
    const dayIndex = (today.getDay() + 6) % 7;
    $('#today-date').textContent = formatDate(today, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const lessons = scheduledCourses
      .filter((course) => course.day === dayIndex)
      .sort((first, second) => first.start - second.start);

    if (!lessons.length) {
      $('#today-list').innerHTML = `<p class="empty-day"><i class="fa-regular fa-calendar"></i> ${registeredCourses.length ? 'Hôm nay bạn không có tiết học.' : 'Chưa có môn học nào được xác nhận.'}</p>`;
      return;
    }

    $('#today-list').innerHTML = lessons.map((course) => {
      const times = getClassTimes(course);
      return `<article class="today-item" style="--class-color:${course.color}">
        <span class="today-time">${times.start} – ${times.end}</span>
        <span><strong>${escapeHTML(course.name)}</strong><small>${escapeHTML(course.code)} · ${escapeHTML(course.teacher)}</small></span>
        <span class="today-room"><i class="fa-solid fa-location-dot"></i> Phòng ${escapeHTML(course.room)}</span>
      </article>`;
    }).join('');
  }

  function renderSchedule(recomputeAI = false) {
    registeredCourses = loadConfirmedCourses();
    plan = loadSavedPlan(registeredCourses);
    if (aiMode) {
      if (recomputeAI) {
        const recommendation = recommendSchedule(registeredCourses);
        if (recommendation) {
          plan = recommendation;
          savePlan(recommendation);
          scheduleMessage = 'Bộ gợi ý AI cục bộ đã chọn các lớp không trùng giờ, ưu tiên ít ngày đến trường và giảm giờ trống.';
        } else {
          scheduleMessage = 'Không tìm được phương án minh họa không trùng lịch cho toàn bộ môn đã đăng ký. Hãy kiểm tra dữ liệu lớp học.';
        }
      } else {
        scheduleMessage = 'Đang dùng lịch AI đã lưu. Lịch lớp hiện là dữ liệu minh họa.';
      }
    } else {
      scheduleMessage = registeredCourses.length
        ? 'Lịch lớp hiện dùng dữ liệu minh họa. Bật gợi ý AI cục bộ để ưu tiên ít ngày học và hạn chế giờ trống.'
        : 'Chưa có môn đăng ký. Hãy chọn môn trong Courses để đồng bộ thời khóa biểu và học phí.';
    }

    const scheduledCourses = getScheduledCourses();
    renderSummary(scheduledCourses);
    renderWeek(scheduledCourses);
    renderToday(scheduledCourses);
    $('#schedule-note').innerHTML = `<i class="fa-solid fa-circle-info"></i> ${escapeHTML(scheduleMessage)} Dữ liệu giờ học hiện là minh họa.`;
    const aiButton = $('#ai-schedule');
    aiButton.classList.toggle('is-active', aiMode);
    aiButton.setAttribute('aria-pressed', String(aiMode));
    aiButton.innerHTML = aiMode
      ? '<i class="fa-solid fa-wand-magic-sparkles"></i> Tắt chế độ AI'
      : '<i class="fa-solid fa-wand-magic-sparkles"></i> AI xếp lịch';
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

  $('#ai-schedule').addEventListener('click', () => {
    if (aiMode) {
      aiMode = false;
      saveMode();
      renderSchedule();
      return;
    }
    const recommendation = recommendSchedule(loadConfirmedCourses());
    if (!recommendation) {
      scheduleMessage = 'Không tìm được phương án minh họa không trùng lịch cho toàn bộ môn đã đăng ký.';
      $('#schedule-note').textContent = scheduleMessage;
      return;
    }
    aiMode = true;
    saveMode();
    savePlan(recommendation);
    renderSchedule();
  });

  $('#previous-week').addEventListener('click', () => {
    weekStart.setDate(weekStart.getDate() - 7);
    renderSchedule();
  });
  $('#next-week').addEventListener('click', () => {
    weekStart.setDate(weekStart.getDate() + 7);
    renderSchedule();
  });
  $('#today-button').addEventListener('click', () => {
    weekStart = mondayOf(today);
    renderSchedule();
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
  window.addEventListener('storage', (event) => {
    if (event.key === getStudentStorageKey('sc_schedule_mode')) {
      aiMode = event.newValue === 'ai';
      renderSchedule();
    } else if (event.key === null || [
      'sc_registered',
      'sc_registered_courses',
      'sc_confirmed_courses',
      'sc_schedule_plan'
    ].map((key) => getStudentStorageKey(key)).includes(event.key)) {
      renderSchedule(aiMode && (event.key === null || event.key === getStudentStorageKey('sc_registered_courses')));
    }
  });

  renderSchedule(aiMode);
});
