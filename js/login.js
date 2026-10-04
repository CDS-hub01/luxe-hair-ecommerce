// login.js
// Checks entered email/password against saved users, logs them in if
// correct, and redirects back to wherever they were trying to go.

const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('login-email');
const passwordInput = document.getElementById('login-password');
const loginFormError = document.getElementById('login-form-error');

const getUsers = () => JSON.parse(localStorage.getItem('users')) || [];

const handleLogin = (event) => {
  event.preventDefault();
  loginFormError.hidden = true;

  const users = getUsers();
  const matchedUser = users.find(
    (user) =>
      user.email.toLowerCase() === emailInput.value.toLowerCase() &&
      user.password === passwordInput.value,
  );

  if (!matchedUser) {
    loginFormError.textContent = 'Incorrect email or password.';
    loginFormError.hidden = false;
    return;
  }

  localStorage.setItem(
    'currentUser',
    JSON.stringify({
      id: matchedUser.id,
      name: matchedUser.name,
      email: matchedUser.email,
    }),
  );

  const redirectTarget =
    sessionStorage.getItem('redirectAfterAuth') || 'shop.html';
  sessionStorage.removeItem('redirectAfterAuth');
  window.location.href = redirectTarget;
};

loginForm.addEventListener('submit', handleLogin);
