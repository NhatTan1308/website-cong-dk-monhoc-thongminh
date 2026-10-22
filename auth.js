document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.querySelector('#register-form');
  const loginForm = document.querySelector('#login-form');
  const form = registerForm || loginForm;
  const status = document.querySelector('#form-status');
  const themeToggle = document.querySelector('#theme-toggle');
  const accountsKey = 'sc_accounts';
  const hashIterations = 210000;

  const setTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    if (themeToggle) {
      themeToggle.innerHTML = `<i class="fa-solid fa-${theme === 'dark' ? 'sun' : 'moon'}" aria-hidden="true"></i>`;
      themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối');
      themeToggle.title = theme === 'dark' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối';
    }
  };
  setTheme(document.documentElement.dataset.theme || 'light');

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = theme;
      try {
        localStorage.setItem('sc_theme', theme);
      } catch (error) {
        console.warn('Không thể lưu tùy chọn giao diện.', error);
      }
      setTheme(theme);
    });
  }

  document.querySelectorAll('[data-password-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      const input = document.getElementById(button.dataset.passwordToggle);
      const showPassword = input.type === 'password';
      input.type = showPassword ? 'text' : 'password';
      button.setAttribute('aria-pressed', String(showPassword));
      button.setAttribute('aria-label', showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu');
      button.innerHTML = `<i class="fa-regular fa-eye${showPassword ? '-slash' : ''}" aria-hidden="true"></i>`;
      input.focus();
    });
  });

  if (!form) return;

  const showStatus = (message, isError = false) => {
    status.textContent = message;
    status.classList.toggle('is-error', isError);
    status.classList.add('is-visible');
  };

  if (loginForm && new URLSearchParams(window.location.search).get('registered') === '1') {
    showStatus('Đăng ký tài khoản thành công. Hãy đăng nhập bằng MSSV và mật khẩu vừa tạo.');
    window.history.replaceState({}, '', window.location.pathname);
  }

  const getAccounts = () => {
    let stored;
    try {
      stored = localStorage.getItem(accountsKey);
    } catch (error) {
      throw new Error('Không thể đọc tài khoản từ localStorage của trình duyệt.');
    }
    if (stored === null) return [];

    let accounts;
    try {
      accounts = JSON.parse(stored);
    } catch (error) {
      throw new Error('Dữ liệu tài khoản trong localStorage không hợp lệ.');
    }
    if (!Array.isArray(accounts) || accounts.some((account) =>
      !account || typeof account.studentId !== 'string' || typeof account.name !== 'string' ||
      typeof account.salt !== 'string' || typeof account.passwordHash !== 'string' ||
      !/^(?:[0-9a-f]{2}){16}$/i.test(account.salt) ||
      !/^(?:[0-9a-f]{2}){32}$/i.test(account.passwordHash) ||
      !Number.isInteger(account.iterations) || account.iterations < 100000 || account.iterations > 1000000
    )) {
      throw new Error('Cấu trúc dữ liệu tài khoản trong localStorage không hợp lệ.');
    }
    return accounts;
  };

  const saveAccounts = (accounts) => {
    try {
      localStorage.setItem(accountsKey, JSON.stringify(accounts));
    } catch (error) {
      throw new Error('Không thể lưu tài khoản. Hãy kiểm tra dung lượng hoặc quyền lưu trữ của trình duyệt.');
    }
  };

  const toHex = (bytes) => Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  const fromHex = (hex) => {
    if (!/^(?:[0-9a-f]{2})+$/i.test(hex)) throw new Error('Dữ liệu bảo mật tài khoản không hợp lệ.');
    return Uint8Array.from(hex.match(/.{2}/g), (byte) => parseInt(byte, 16));
  };

  const hashPassword = async (password, salt, iterations) => {
    if (!window.crypto || !window.crypto.subtle) {
      throw new Error('Trình duyệt không hỗ trợ mã hóa mật khẩu an toàn. Hãy mở trang qua localhost hoặc dùng trình duyệt hiện đại.');
    }
    const key = await window.crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      'PBKDF2',
      false,
      ['deriveBits']
    );
    const result = await window.crypto.subtle.deriveBits({
      name: 'PBKDF2',
      salt: fromHex(salt),
      iterations,
      hash: 'SHA-256'
    }, key, 256);
    return toHex(new Uint8Array(result));
  };

  const setInputValidity = (inputs) => {
    inputs.forEach((input) => input.setAttribute('aria-invalid', String(!input.validity.valid)));
    return inputs.every((input) => input.validity.valid);
  };

  const password = document.querySelector('#password');
  const confirmPassword = document.querySelector('#confirm-password');

  const updateConfirmPasswordValidity = () => {
    if (!confirmPassword || !password) return;
    confirmPassword.setCustomValidity(
      confirmPassword.value && confirmPassword.value !== password.value
        ? 'Mật khẩu xác nhận không khớp.'
        : ''
    );
  };

  if (registerForm) {
    const fullName = document.querySelector('#full-name');
    const studentId = document.querySelector('#student-id');
    const major = document.querySelector('#major');

    const updatePasswordValidity = () => {
      const rules = {
        length: password.value.length >= 9,
        uppercase: /[A-Z]/.test(password.value),
        special: /[!@#$%^&*]/.test(password.value)
      };
      Object.entries(rules).forEach(([name, met]) => {
        document.querySelector(`[data-rule="${name}"]`).classList.toggle('is-met', met);
      });
      password.setCustomValidity(
        password.value && !Object.values(rules).every(Boolean)
          ? 'Mật khẩu cần ít nhất 9 ký tự, gồm chữ viết hoa và ký tự đặc biệt (!@#$%^&*).'
          : ''
      );
      updateConfirmPasswordValidity();
    };

    password.addEventListener('input', updatePasswordValidity);
    confirmPassword.addEventListener('input', updateConfirmPasswordValidity);

    registerForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      updatePasswordValidity();
      updateConfirmPasswordValidity();
      const inputs = Array.from(registerForm.querySelectorAll('input, select'));
      if (!setInputValidity(inputs) || !registerForm.reportValidity()) return;

      const submitButton = registerForm.querySelector('.auth-submit');
      submitButton.disabled = true;
      try {
        const accounts = getAccounts();
        const normalizedId = studentId.value.trim().toLowerCase();
        if (accounts.some((account) => account.studentId.toLowerCase() === normalizedId)) {
          studentId.setCustomValidity('MSSV này đã được đăng ký.');
          studentId.setAttribute('aria-invalid', 'true');
          studentId.reportValidity();
          return;
        }

        if (!window.crypto || !window.crypto.subtle) {
          throw new Error('Trình duyệt không hỗ trợ mã hóa mật khẩu an toàn. Hãy mở trang qua localhost hoặc dùng trình duyệt hiện đại.');
        }
        const salt = toHex(window.crypto.getRandomValues(new Uint8Array(16)));
        const passwordHash = await hashPassword(password.value, salt, hashIterations);
        accounts.push({
          studentId: studentId.value.trim(),
          name: fullName.value.trim(),
          major: major.value,
          birthDate: '',
          address: '',
          phone: '',
          personalEmail: '',
          avatar: '',
          salt,
          passwordHash,
          iterations: hashIterations
        });
        saveAccounts(accounts);
        window.location.href = 'login.html?registered=1';
      } catch (error) {
        showStatus(error.message || 'Không thể tạo tài khoản. Vui lòng thử lại.', true);
      } finally {
        submitButton.disabled = false;
      }
    });
  }

  if (loginForm) {
    const studentId = document.querySelector('#student-id');
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const inputs = Array.from(loginForm.querySelectorAll('input'));
      if (!setInputValidity(inputs) || !loginForm.reportValidity()) return;

      const submitButton = loginForm.querySelector('.auth-submit');
      submitButton.disabled = true;
      try {
        const normalizedId = studentId.value.trim().toLowerCase();
        const account = getAccounts().find((item) => item.studentId.toLowerCase() === normalizedId);
        if (!account) {
          showStatus('MSSV hoặc mật khẩu không đúng.', true);
          return;
        }

        const passwordHash = await hashPassword(password.value, account.salt, account.iterations);
        if (passwordHash !== account.passwordHash) {
          showStatus('MSSV hoặc mật khẩu không đúng.', true);
          return;
        }

        try {
          sessionStorage.setItem('sc_user', JSON.stringify({
            name: account.name,
            mssv: account.studentId,
            major: account.major,
            majorName: account.major,
            birthDate: account.birthDate || '',
            address: account.address || '',
            phone: account.phone || '',
            personalEmail: account.personalEmail || '',
            avatar: account.avatar || ''
          }));
        } catch (error) {
          throw new Error('Đăng nhập thành công nhưng không thể lưu phiên đăng nhập trong trình duyệt.');
        }
        window.location.href = 'index.html';
      } catch (error) {
        showStatus(error.message || 'Không thể đăng nhập. Vui lòng thử lại.', true);
      } finally {
        submitButton.disabled = false;
      }
    });
  }

  form.addEventListener('input', (event) => {
    status.classList.remove('is-visible', 'is-error');
    status.textContent = '';
    if (event.target.matches('input')) event.target.removeAttribute('aria-invalid');
    if (registerForm && event.target === document.querySelector('#student-id')) {
      event.target.setCustomValidity('');
    }
    if (registerForm && event.target === password) {
      updateConfirmPasswordValidity();
    }
  });

  form.addEventListener('change', (event) => {
    status.classList.remove('is-visible', 'is-error');
    status.textContent = '';
    if (event.target.matches('select')) event.target.removeAttribute('aria-invalid');
  });
});
