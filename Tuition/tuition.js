/* Logic trang học phí */
document.addEventListener('DOMContentLoaded', () => {
    const $ = (selector) => document.querySelector(selector);
    const read = (store, key, fallback) => {
        try {
            const value = store.getItem(key);
            return value ? JSON.parse(value) : fallback;
        } catch {
            return fallback;
        }
    };
    const money = (value) => `${Number(value || 0).toLocaleString('vi-VN')} ₫`;
    const escapeHTML = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[char]));
    const resolvePageLink = (link) => ({
        'courses.html': '../Courses/courses.html',
        'Courses/courses.html': '../Courses/courses.html',
        'Schedule/Schedule.html': '../Schedule/Schedule.html',
        'login.html': '../Login_Register/login.html',
        'Login/Register/login.html': '../Login_Register/login.html',
        'Login_Register/login.html': '../Login_Register/login.html',
        'register.html': '../Login_Register/register.html',
        'Login/Register/register.html': '../Login_Register/register.html',
        'Login_Register/register.html': '../Login_Register/register.html',
        'settings.html': '../Settings/settings.html',
        'Settings/settings.html': '../Settings/settings.html',
        'tuition.html': 'tuition.html',
        'Tuition/tuition.html': 'tuition.html',
        'home.html': '../index.html',
        'index.html': '../index.html'
    }[link] || link);

    const price = typeof CREDIT_PRICE === 'number' ? CREDIT_PRICE : 500000;
    const extraFeeRate = 150000;
    const deadline = new Date(2026, 9, 15, 23, 59, 59);
    const courses = typeof MOCK_DATA !== 'undefined' && Array.isArray(MOCK_DATA)
        ? MOCK_DATA
        : [];
    const user = read(sessionStorage, 'sc_user', null);

    // Theme
    const setTheme = (theme) => {
        document.documentElement.dataset.theme = theme;
        const button = $('#theme-btn');
        if (!button) return;
        button.innerHTML = `<i class="fa-solid fa-${theme === 'dark' ? 'sun' : 'moon'}"></i>`;
        button.title = theme === 'dark' ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối';
    };
    let savedTheme = 'dark';
    try { savedTheme = localStorage.getItem('sc_theme') || savedTheme; } catch { }
    setTheme(savedTheme);
    $('#theme-btn')?.addEventListener('click', () => {
        const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
        try { localStorage.setItem('sc_theme', nextTheme); } catch { }
        setTheme(nextTheme);
    });

    // Mobile navigation
    const toggleSide = (open) => {
        $('#side')?.classList.toggle('open', open);
        $('#overlay')?.classList.toggle('show', open);
    };
    $('#menu')?.addEventListener('click', () => toggleSide(!$('#side')?.classList.contains('open')));
    $('#overlay')?.addEventListener('click', () => toggleSide(false));

    // Account display and logout
    if (user) {
        const name = String(user.name || 'Sinh viên').trim();
        const parts = name.split(/\s+/);
        const initials = (parts.length > 1
            ? parts[0][0] + parts[parts.length - 1][0]
            : name.slice(0, 2)).toUpperCase();
        $('#guest-actions')?.classList.add('hidden');
        $('#user')?.classList.remove('hidden');
        $('#side-avatar').textContent = initials;
        $('#user-avatar').textContent = initials;
        $('#side-name').textContent = name;
        $('#user-name').textContent = parts.at(-1);
        $('#user-fullname').textContent = name;
        $('#user-email').textContent = user.email || user.mssv || 'Tài khoản sinh viên';
        $('#welcome-title').textContent = `Xin chào, ${parts.at(-1)}!`;
        $('#welcome-desc').textContent = 'Dưới đây là thông tin học phí dựa trên các môn học đã đăng ký.';
    }

    const logout = () => {
        sessionStorage.removeItem('sc_user');
        window.location.href = '../index.html';
    };
    $('#logout-btn')?.addEventListener('click', logout);
    $('#side-logout')?.addEventListener('click', logout);

    // Header popovers
    const popovers = [['#notif-btn', '#notif-pop'], ['#user-btn', '#user-pop']];
    popovers.forEach(([buttonSelector, popoverSelector]) => {
        $(buttonSelector)?.addEventListener('click', (event) => {
            event.stopPropagation();
            popovers.forEach(([, otherSelector]) => {
                if (otherSelector !== popoverSelector) $(otherSelector)?.classList.add('hidden');
            });
            $(popoverSelector)?.classList.toggle('hidden');
        });
    });
    document.addEventListener('click', (event) => {
        popovers.forEach(([, selector]) => {
            const popover = $(selector);
            if (popover && !popover.contains(event.target)) popover.classList.add('hidden');
        });
    });

    // Notifications
    const defaultNews = [
        { id: 1, title: 'Hạn đăng ký môn học: 15/10/2026', desc: 'Vui lòng kiểm tra thông tin đăng ký môn học.', time: 'Thông báo', type: 'warning', icon: 'fa-triangle-exclamation', unread: true, link: '../Courses/courses.html' },
        { id: 2, title: 'Nhắc nhở học phí học kỳ', desc: 'Kiểm tra chi tiết học phí và thời hạn thanh toán.', time: 'Thông báo', type: 'info', icon: 'fa-receipt', unread: true, link: 'tuition.html' }
    ];
    const getNews = () => read(localStorage, 'sc_notifications', null) || defaultNews.map((item) => ({ ...item }));
    const saveNews = (news) => {
        try { localStorage.setItem('sc_notifications', JSON.stringify(news)); } catch { }
    };
    function renderNews() {
        const news = getNews();
        const badge = $('#notif-n');
        if (badge) {
            const unreadCount = news.filter((item) => item.unread).length;
            badge.textContent = unreadCount;
            badge.classList.toggle('hidden', unreadCount === 0);
        }
        const list = $('#notif-list');
        if (list) {
            list.innerHTML = news.map((item) => `
                <a class="nitem ${item.unread ? 'unread' : ''}" href="${escapeHTML(resolvePageLink(item.link || '#'))}" data-id="${escapeHTML(item.id)}">
                    <span class="ni ${escapeHTML(item.type || 'info')}"><i class="fa-solid ${escapeHTML(item.icon || 'fa-bell')}"></i></span>
                    <span><b>${escapeHTML(item.title)}</b><small>${escapeHTML(item.desc)}</small><em>${escapeHTML(item.time)}</em></span>
                </a>`).join('');
        }
    }
    $('#mark-read')?.addEventListener('click', (event) => {
        event.stopPropagation();
        saveNews(getNews().map((item) => ({ ...item, unread: false })));
        renderNews();
    });
    $('#notif-list')?.addEventListener('click', (event) => {
        const item = event.target.closest('.nitem');
        if (!item) return;
        const news = getNews();
        const selected = news.find((entry) => String(entry.id) === item.dataset.id);
        if (selected?.unread) {
            selected.unread = false;
            saveNews(news);
        }
    });

    function renderTuition() {
        const savedIds = read(localStorage, 'sc_registered_courses', null);
        const legacyRegistrations = read(localStorage, 'sc_registered', []);
        const registrations = Array.isArray(savedIds)
            ? savedIds
            : (Array.isArray(legacyRegistrations) ? legacyRegistrations : [])
                .map((registration) => registration.courseId);
        const registeredIds = new Set(registrations.map(String));
        const items = courses
            .filter((course) => registeredIds.has(String(course.id)))
            .map((course) => ({ course, fee: Number(course.credits || 0) * price }));
        const courseFee = items.reduce((sum, item) => sum + item.fee, 0);
        const extraFee = items.length ? extraFeeRate : 0;
        const totalFee = courseFee + extraFee;
        let paid = false;
        try { paid = localStorage.getItem('sc_paid') === '1'; } catch (error) {
            console.warn('Không thể đọc trạng thái thanh toán.', error);
        }

        $('#total-fee').textContent = money(totalFee);
        $('#course-fee').textContent = money(courseFee);
        $('#extra-fee').textContent = money(extraFee);
        $('#total-fee-desc').textContent = `${items.length} môn học đã ghi nhận`;
        $('#course-fee-desc').textContent = `${items.reduce((sum, item) => sum + Number(item.course.credits || 0), 0)} tín chỉ`;
        $('#payment-status').textContent = paid ? 'Đã thanh toán' : 'Chưa thanh toán';
        $('#payment-status-desc').textContent = paid ? 'Theo dữ liệu mô phỏng' : 'Chưa có xác nhận thanh toán';
        $('#course-count').textContent = `${items.length} môn`;
        $('#tuition-table-body').innerHTML = items.length
            ? items.map(({ course, fee }) => `
                <tr><td class="course-name">${escapeHTML(course.name)}<span class="course-code">${escapeHTML(course.code || '')}</span></td>
                    <td>${Number(course.credits || 0)}</td><td class="text-right">${money(price)}</td>
                    <td class="text-right amount">${money(fee)}</td></tr>`).join('')
            : `<tr><td colspan="4" class="empty-cell"><i class="fa-solid fa-receipt"></i><br>
                ${user ? 'Chưa có môn học được ghi nhận. Hãy đăng ký môn học trước.' : 'Đăng nhập để xem dữ liệu học phí theo tài khoản.'}<br>
                <a href="${user ? '../Courses/courses.html' : '../Login_Register/login.html'}">${user ? 'Đăng ký môn học' : 'Đăng nhập ngay'} →</a></td></tr>`;
        $('#summary-course-fee').textContent = money(courseFee);
        $('#summary-extra-fee').textContent = money(extraFee);
        $('#summary-total-fee').textContent = money(totalFee);
    }

    renderTuition();
    window.addEventListener('storage', (event) => {
        if (event.key === 'sc_registered_courses' || event.key === 'sc_registered' || event.key === 'sc_paid') {
            renderTuition();
        }
    });

    // Deadline
    $('#deadline-date').textContent = '15/10/2026';
    const status = $('#deadline-status');
    const description = $('#deadline-desc');
    if (new Date() > deadline) {
        status.classList.add('past');
        status.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Đã qua thời hạn minh họa';
        description.textContent = 'Ngày hạn mẫu đã qua. Vui lòng kiểm tra thông báo chính thức của nhà trường.';
    } else {
        status.innerHTML = '<i class="fa-regular fa-clock"></i> Chưa đến hạn mẫu';
        description.textContent = 'Hãy kiểm tra thông báo chính thức để xác nhận hạn thanh toán.';
    }

    renderNews();
});


document.addEventListener("DOMContentLoaded", function () {
    const openBtn = document.getElementById("open-qr-btn");
    const closeBtn = document.getElementById("close-qr-btn");
    const modal = document.getElementById("qr-modal");
    const overlay = document.getElementById("qr-overlay");

    const totalFee = document.getElementById("summary-total-fee");
    const qrTotalFee = document.getElementById("qr-total-fee");

    if (!openBtn || !closeBtn || !modal || !overlay) return;

    function openQR() {
        if (totalFee && qrTotalFee) {
            qrTotalFee.textContent = totalFee.textContent;
        }

        modal.classList.add("show");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        closeBtn.focus();
    }

    function closeQR() {
        modal.classList.remove("show");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        openBtn.focus();
    }

    openBtn.addEventListener("click", openQR);
    closeBtn.addEventListener("click", closeQR);
    overlay.addEventListener("click", closeQR);

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && modal.classList.contains("show")) {
            closeQR();
        }
    });
});
