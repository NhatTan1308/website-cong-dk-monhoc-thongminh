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
  let scheduleMode = 'manual';
  let manualEditing = false;
  let scheduleMessage = '';
  let scheduleStorageError = '';
  let draggedCourseId = null;
  let dragMessage = '';
  try {
    const savedMode = getStudentStorageItem('sc_schedule_mode');
    scheduleMode = savedMode === 'ai' || savedMode === 'auto' || savedMode === 'smart' ? 'smart' : 'manual';
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
      const savedSelection = scheduleStorageError && plan.has(course.id)
        ? plan.get(course.id)
        : savedPlan && savedPlan[course.id];
      const selection = Number(savedSelection);
      result.set(course.id, Number.isInteger(selection) && options[selection] ? selection : 0);
    });
    return result;
  }

  function savePlan(nextPlan) {
    const serializable = Object.fromEntries(nextPlan);
    try {
      setStudentStorageItem('sc_schedule_plan', JSON.stringify(serializable));
      plan = nextPlan;
      scheduleStorageError = '';
      return true;
    } catch (error) {
      console.error('Không thể lưu thời khóa biểu.', error);
      scheduleStorageError = 'Không thể lưu lịch trên thiết bị này. Hãy kiểm tra quyền truy cập bộ nhớ trình duyệt.';
      return false;
    }
  }

  function saveMode() {
    try {
      setStudentStorageItem('sc_schedule_mode', scheduleMode);
    } catch (error) {
      console.error('Không thể lưu chế độ xếp lịch.', error);
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

  function getScheduleIssues(scheduledCourses) {
    const issues = new Map();
    const addIssue = (courseId, reason) => {
      if (!issues.has(courseId)) issues.set(courseId, []);
      issues.get(courseId).push(reason);
    };

    scheduledCourses.forEach((course, index) => {
      scheduledCourses.slice(index + 1).forEach((other) => {
        if (course.day !== other.day) return;
        if (course.start <= other.end && other.start <= course.end) {
          addIssue(course.id, `Trùng lịch với ${other.code} (${DAYS[other.day]}, tiết ${other.start}–${other.end}).`);
          addIssue(other.id, `Trùng lịch với ${course.code} (${DAYS[course.day]}, tiết ${course.start}–${course.end}).`);
          return;
        }

        const earlier = course.end < other.start ? course : other;
        const later = earlier === course ? other : course;
        if (earlier.end + 1 === later.start
          && PERIODS[earlier.end - 1][1] === PERIODS[later.start - 1][0]) {
          addIssue(earlier.id, `Lịch sát với ${later.code}, không có thời gian nghỉ hoặc di chuyển.`);
          addIssue(later.id, `Lịch sát với ${earlier.code}, không có thời gian nghỉ hoặc di chuyển.`);
        }
      });
    });
    return issues;
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
    const issues = manualEditing ? getScheduleIssues(scheduledCourses) : new Map();
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
        cells.push(`<div class="board-cell board-slot" data-day="${dayIndex}" data-period="${period}" style="grid-column:${dayIndex + 2};grid-row:${period + 1}" aria-hidden="true"></div>`);
      });
    });

    const classes = scheduledCourses.map((course) => {
      const times = getClassTimes(course);
      const safeName = escapeHTML(course.name);
      const safeCode = escapeHTML(course.code);
      const safeRoom = escapeHTML(`Phòng ${course.room}`);
      const safeTeacher = escapeHTML(course.teacher);
      const courseIssues = issues.get(course.id) || [];
      const safeIssues = courseIssues.map(escapeHTML);
      const options = DEMO_CLASS_OPTIONS.get(course.id) || [];
      const selectedIndex = plan.get(course.id) || 0;
      const editor = manualEditing ? `<label class="manual-class-editor">Chọn lớp
        <select data-course-id="${escapeHTML(course.id)}" aria-label="Chọn lớp cho ${safeCode}">
          ${options.map((section, index) => `<option value="${index}"${index === selectedIndex ? ' selected' : ''}>Lớp ${escapeHTML(section.section)} · ${DAYS[section.day]} · tiết ${section.start}–${section.end}</option>`).join('')}
        </select>
      </label>` : '';
      const issueDetails = safeIssues.map((reason) => `<span class="schedule-class-issue"><i class="fa-solid fa-triangle-exclamation"></i>${reason}</span>`).join('');
      return `<article class="schedule-class${manualEditing ? ' is-editing' : ''}${courseIssues.length ? ' has-schedule-issue' : ''}" data-course-id="${course.id}" data-day="${course.day}" data-start="${course.start}" data-end="${course.end}" draggable="${manualEditing}" style="--class-color:${course.color};grid-column:${course.day + 2};grid-row:${course.start + 1}/${course.end + 2}" aria-label="${safeName}, ${DAYS[course.day]}, ${times.start} đến ${times.end}, ${safeRoom}${manualEditing ? ', có thể kéo sang ca học đã mở' : ''}${courseIssues.length ? `, Lỗi lịch: ${safeIssues.join(' ')}` : ''}">
        <strong>${safeCode} · Lớp ${course.section}</strong>
        <span class="class-name">${safeName}</span>
        <span><i class="fa-regular fa-clock"></i>${times.start}–${times.end}</span>
        <span><i class="fa-solid fa-location-dot"></i>${safeRoom}</span>
        <span><i class="fa-solid fa-user"></i>${safeTeacher}</span>
        ${editor}${issueDetails}
      </article>`;
    });

    $('#schedule-board').innerHTML = cells.join('') + classes.join('');
  }

  function renderToday(scheduledCourses) {
    const dayIndex = (today.getDay() + 6) % 7;
    $('#today-date').textContent = formatDate(today, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const issues = manualEditing ? getScheduleIssues(scheduledCourses) : new Map();
    const lessons = scheduledCourses
      .filter((course) => course.day === dayIndex)
      .sort((first, second) => first.start - second.start);

    if (!lessons.length) {
      $('#today-list').innerHTML = `<p class="empty-day"><i class="fa-regular fa-calendar"></i> ${registeredCourses.length ? 'Hôm nay bạn không có tiết học.' : 'Chưa có môn học nào được xác nhận.'}</p>`;
      return;
    }

    $('#today-list').innerHTML = lessons.map((course) => {
      const times = getClassTimes(course);
      const courseIssues = issues.get(course.id) || [];
      return `<article class="today-item${courseIssues.length ? ' has-schedule-issue' : ''}" style="--class-color:${course.color}">
        <span class="today-time">${times.start} – ${times.end}</span>
        <span><strong>${escapeHTML(course.name)}</strong><small>${escapeHTML(course.code)} · ${escapeHTML(course.teacher)}</small></span>
        <span class="today-room"><i class="fa-solid fa-location-dot"></i> Phòng ${escapeHTML(course.room)}</span>
        ${courseIssues.map((reason) => `<span class="today-issue"><i class="fa-solid fa-triangle-exclamation"></i>${escapeHTML(reason)}</span>`).join('')}
      </article>`;
    }).join('');
  }

  function renderSchedule(recomputeMode = false) {
    registeredCourses = loadConfirmedCourses();
    plan = loadSavedPlan(registeredCourses);
    if (scheduleMode === 'smart' && recomputeMode) {
      const recommendation = recommendSchedule(registeredCourses);
      if (recommendation) {
        plan = recommendation;
        savePlan(recommendation);
        scheduleMessage = 'Đã chọn phương án không trùng giờ, ưu tiên ít ngày đến trường và giảm giờ trống.';
      } else {
        scheduleMessage = 'Không tìm được phương án minh họa không trùng lịch cho toàn bộ môn đã đăng ký. Hãy kiểm tra dữ liệu lớp học.';
      }
    } else if (scheduleMode === 'smart') {
      scheduleMessage = 'Đang dùng lịch tự động thông minh đã lưu. Lịch lớp hiện là dữ liệu minh họa.';
    } else {
      scheduleMessage = registeredCourses.length
        ? manualEditing
          ? 'Chế độ chỉnh tay: thay đổi lớp bên dưới để cập nhật thời khóa biểu.'
          : 'Lịch lớp hiện dùng dữ liệu minh họa. Chọn “Chỉnh lịch tay” để thay đổi lớp học.'
        : 'Chưa có môn đăng ký. Hãy chọn môn trong Courses để đồng bộ thời khóa biểu và học phí.';
    }

    const scheduledCourses = getScheduledCourses();
    const issues = manualEditing ? getScheduleIssues(scheduledCourses) : new Map();
    renderSummary(scheduledCourses);
    renderWeek(scheduledCourses);
    renderToday(scheduledCourses);
    const issueMessages = [...new Set([...issues.values()].flat())];
    const issueSummary = issueMessages.length
      ? `<span class="schedule-issue-summary"><i class="fa-solid fa-triangle-exclamation"></i> Có ${issueMessages.length} vấn đề cần xử lý: ${issueMessages.map(escapeHTML).join(' ')}</span>`
      : '';
    const storageError = scheduleStorageError
      ? `<span class="schedule-issue-summary"><i class="fa-solid fa-triangle-exclamation"></i> ${escapeHTML(scheduleStorageError)}</span>`
      : '';
    const dragHelp = manualEditing
      ? ' Kéo thẻ lớp đến một ca học được mở cho môn đó; dùng danh sách chọn lớp nếu cần.'
      : '';
    const dragNotice = dragMessage
      ? `<span class="schedule-issue-summary">${escapeHTML(dragMessage)}</span>`
      : '';
    $('#schedule-note').innerHTML = `<i class="fa-solid fa-circle-info"></i> ${escapeHTML(scheduleMessage)} Dữ liệu giờ học hiện là minh họa.${escapeHTML(dragHelp)}${issueSummary}${storageError}${dragNotice}`;
    const smartButton = $('#smart-schedule');
    smartButton.classList.toggle('is-active', scheduleMode === 'smart');
    smartButton.setAttribute('aria-pressed', String(scheduleMode === 'smart'));
    $('#manual-schedule').classList.toggle('is-active', manualEditing);
    $('#manual-schedule').setAttribute('aria-pressed', String(manualEditing));
    $('#manual-schedule').innerHTML = manualEditing
      ? '<i class="fa-solid fa-check"></i> Xong chỉnh sửa'
      : '<i class="fa-solid fa-pen-to-square"></i> Chỉnh lịch tay';
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

  $('#smart-schedule').addEventListener('click', () => {
    const recommendation = recommendSchedule(loadConfirmedCourses());
    if (!recommendation) {
      scheduleMessage = 'Không tìm được phương án minh họa không trùng lịch cho toàn bộ môn đã đăng ký.';
      $('#schedule-note').textContent = scheduleMessage;
      return;
    }
    scheduleMode = 'smart';
    manualEditing = false;
    plan = recommendation;
    saveMode();
    savePlan(recommendation);
    scheduleMessage = 'Đã chọn phương án không trùng giờ, ưu tiên ít ngày đến trường và giảm giờ trống.';
    dragMessage = '';
    renderSchedule();
  });

  $('#manual-schedule').addEventListener('click', () => {
    scheduleMode = 'manual';
    manualEditing = !manualEditing;
    saveMode();
    dragMessage = '';
    renderSchedule();
  });

  $('#schedule-board').addEventListener('change', (event) => {
    const selector = event.target.closest('select[data-course-id]');
    if (!selector) return;
    const courseId = Number(selector.dataset.courseId);
    const sectionIndex = Number(selector.value);
    const options = DEMO_CLASS_OPTIONS.get(courseId) || [];
    if (!Number.isInteger(sectionIndex) || !options[sectionIndex]) {
      console.error('Không thể cập nhật lịch: lớp học được chọn không hợp lệ.');
      return;
    }

    const nextPlan = new Map(plan);
    nextPlan.set(courseId, sectionIndex);
    scheduleMode = 'manual';
    manualEditing = true;
    saveMode();
    if (!savePlan(nextPlan)) {
      plan = nextPlan;
    }
    dragMessage = '';
    renderSchedule();
  });

  const scheduleBoard = $('#schedule-board');
  scheduleBoard.addEventListener('dragstart', (event) => {
    const scheduleClass = event.target.closest('.schedule-class[draggable="true"]');
    if (!scheduleClass || !manualEditing) {
      event.preventDefault();
      return;
    }
    draggedCourseId = Number(scheduleClass.dataset.courseId);
    scheduleBoard.classList.add('is-dragging');
    scheduleClass.classList.add('is-dragging');
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', String(draggedCourseId));
  });

  scheduleBoard.addEventListener('dragend', (event) => {
    const scheduleClass = event.target.closest('.schedule-class');
    if (scheduleClass) scheduleClass.classList.remove('is-dragging');
    scheduleBoard.classList.remove('is-dragging');
    draggedCourseId = null;
  });

  scheduleBoard.addEventListener('dragover', (event) => {
    if (!manualEditing || draggedCourseId === null) return;
    if (event.target.closest('.board-slot, .schedule-class')) event.preventDefault();
  });

  scheduleBoard.addEventListener('drop', (event) => {
    if (!manualEditing || draggedCourseId === null) return;
    const target = event.target.closest('.board-slot, .schedule-class');
    if (!target) return;
    event.preventDefault();
    const courseId = draggedCourseId;
    draggedCourseId = null;
    scheduleBoard.classList.remove('is-dragging');

    let targetDay = Number(target.dataset.day);
    let targetPeriod = Number(target.dataset.period || target.dataset.start);
    if (target.classList.contains('schedule-class')) {
      const periodCount = Number(target.dataset.end) - Number(target.dataset.start) + 1;
      const targetBounds = target.getBoundingClientRect();
      const periodHeight = targetBounds.height / periodCount;
      targetPeriod = Number(target.dataset.start)
        + Math.min(periodCount - 1, Math.floor((event.clientY - targetBounds.top) / periodHeight));
    }

    const options = DEMO_CLASS_OPTIONS.get(courseId) || [];
    const sectionIndex = options.findIndex((section) => (
      section.day === targetDay && section.start <= targetPeriod && section.end >= targetPeriod
    ));
    if (sectionIndex < 0) {
      dragMessage = 'Không thể thả vào vị trí này: môn học không mở lớp ở ca đó. Hãy thả vào một ca lớp đang mở.';
      renderSchedule();
      return;
    }

    const nextPlan = new Map(plan);
    nextPlan.set(courseId, sectionIndex);
    scheduleMode = 'manual';
    saveMode();
    if (!savePlan(nextPlan)) plan = nextPlan;
    dragMessage = '';
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
      scheduleMode = event.newValue === 'ai' || event.newValue === 'auto' || event.newValue === 'smart' ? 'smart' : 'manual';
      renderSchedule();
    } else if (event.key === null || [
      'sc_registered',
      'sc_registered_courses',
      'sc_confirmed_courses',
      'sc_schedule_plan'
    ].map((key) => getStudentStorageKey(key)).includes(event.key)) {
      renderSchedule(scheduleMode !== 'manual' && (event.key === null || event.key === getStudentStorageKey('sc_registered_courses')));
    }
  });

  renderSchedule(scheduleMode !== 'manual');
});
