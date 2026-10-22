document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('profile-form');
  const status = document.getElementById('form-status');
  const saveButton = document.getElementById('save-button');
  const avatarFile = document.getElementById('avatar-file');
  const avatarPreview = document.getElementById('avatar-preview');
  const accountsKey = 'sc_accounts';
  const sessionKey = 'sc_user';
  let session;
  let invalidSession = false;
  try {
    session = (() => {
      return JSON.parse(sessionStorage.getItem(sessionKey) || 'null');
    })();
  } catch (error) {
    invalidSession = true;
  }

  if (!session || typeof session.mssv !== 'string') {
    if (invalidSession) {
      status.textContent = 'Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.';
      status.classList.add('visible', 'error');
    }
    window.location.replace('login.html');
    return;
  }

  const showStatus = (message, isError = false) => {
    status.textContent = message;
    status.classList.toggle('error', isError);
    status.classList.add('visible');
  };
  const readAccounts = () => {
    let raw;
    try {
      raw = localStorage.getItem(accountsKey);
    } catch (error) {
      throw new Error('Không thể đọc thông tin tài khoản từ trình duyệt.');
    }
    if (!raw) throw new Error('Không tìm thấy dữ liệu tài khoản. Vui lòng đăng nhập lại.');
    let accounts;
    try {
      accounts = JSON.parse(raw);
    } catch (error) {
      throw new Error('Dữ liệu tài khoản trong trình duyệt không hợp lệ.');
    }
    if (!Array.isArray(accounts)) throw new Error('Cấu trúc dữ liệu tài khoản không hợp lệ.');
    return accounts;
  };
  const writeAccounts = (accounts) => {
    try {
      localStorage.setItem(accountsKey, JSON.stringify(accounts));
    } catch (error) {
      throw new Error('Không thể lưu hồ sơ. Hãy thử ảnh có dung lượng nhỏ hơn hoặc kiểm tra bộ nhớ trình duyệt.');
    }
  };
  const initials = (name) => {
    const parts = name.trim().split(/\s+/);
    return (parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : name.slice(0, 2)).toUpperCase();
  };
  const setAvatar = (source, name) => {
    avatarPreview.replaceChildren();
    if (typeof source === 'string' && source.startsWith('data:image/')) {
      const image = document.createElement('img');
      image.src = source;
      image.alt = 'Ảnh đại diện';
      image.className = 'avatar-image';
      avatarPreview.appendChild(image);
    } else {
      avatarPreview.textContent = initials(name);
    }
  };
  const setThemeButton = () => {
    const dark = document.documentElement.dataset.theme === 'dark';
    const button = document.getElementById('theme-toggle');
    button.innerHTML = `<i class="fa-solid fa-${dark ? 'sun' : 'moon'}" aria-hidden="true"></i>`;
    button.title = dark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối';
  };

  let accounts;
  let account;
  try {
    accounts = readAccounts();
    account = accounts.find((item) => item.studentId === session.mssv);
    if (!account) throw new Error('Không tìm thấy tài khoản đang đăng nhập. Vui lòng đăng nhập lại.');
  } catch (error) {
    showStatus(error.message || 'Không thể tải hồ sơ.', true);
    form.querySelectorAll('input, textarea, button').forEach((element) => { element.disabled = true; });
    return;
  }

  document.getElementById('full-name').value = account.name;
  document.getElementById('major').value = account.major;
  document.getElementById('student-id').value = account.studentId;
  const birthDateInput = document.getElementById('birth-date');
  const today = new Date();
  birthDateInput.max = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  birthDateInput.value = account.birthDate || '';
  document.getElementById('phone').value = account.phone || '';
  document.getElementById('personal-email').value = account.personalEmail || '';
  document.getElementById('address').value = account.address || '';
  let avatar = account.avatar || '';
  setAvatar(avatar, account.name);
  setThemeButton();

  document.getElementById('theme-toggle').addEventListener('click', () => {
    const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('sc_theme', theme);
    } catch (error) {
      showStatus('Không thể lưu tùy chọn giao diện.', true);
    }
    setThemeButton();
  });

  avatarFile.addEventListener('change', () => {
    const file = avatarFile.files && avatarFile.files[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      avatarFile.value = '';
      showStatus('Vui lòng chọn ảnh JPG, PNG hoặc WebP có dung lượng không quá 5 MB.', true);
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => showStatus('Không thể đọc ảnh đã chọn. Vui lòng thử ảnh khác.', true);
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => showStatus('Tệp ảnh không hợp lệ hoặc không thể mở.', true);
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = Math.min(1, 512 / Math.max(image.width, image.height));
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        const context = canvas.getContext('2d');
        if (!context) {
          showStatus('Trình duyệt không thể xử lý ảnh này.', true);
          return;
        }
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        avatar = canvas.toDataURL('image/jpeg', 0.82);
        setAvatar(avatar, account.name);
        status.classList.remove('visible', 'error');
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

  document.getElementById('remove-avatar').addEventListener('click', () => {
    avatar = '';
    avatarFile.value = '';
    setAvatar('', account.name);
  });

  form.addEventListener('input', () => status.classList.remove('visible', 'error'));
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    saveButton.disabled = true;
    try {
      account.birthDate = document.getElementById('birth-date').value;
      account.phone = document.getElementById('phone').value.trim();
      account.personalEmail = document.getElementById('personal-email').value.trim();
      account.address = document.getElementById('address').value.trim();
      account.avatar = avatar;
      writeAccounts(accounts);
      const updatedSession = {
        ...session,
        name: account.name,
        mssv: account.studentId,
        major: account.major,
        majorName: account.major,
        birthDate: account.birthDate,
        phone: account.phone,
        personalEmail: account.personalEmail,
        address: account.address,
        avatar: account.avatar
      };
      try {
        sessionStorage.setItem(sessionKey, JSON.stringify(updatedSession));
      } catch (error) {
        throw new Error('Hồ sơ đã lưu nhưng không thể cập nhật phiên đăng nhập. Hãy đăng nhập lại để đồng bộ.');
      }
      showStatus('Đã lưu hồ sơ cá nhân thành công.');
    } catch (error) {
      showStatus(error.message || 'Không thể lưu hồ sơ. Vui lòng thử lại.', true);
    } finally {
      saveButton.disabled = false;
    }
  });
});
