// register.js
// Creates a new account, checking the email isn't already registered,
// then logs the new user in and redirects them back to wherever they
// were trying to go (e.g. checkout).

const registerForm = document.getElementById('register-form');
const nameInput = document.getElementById('register-name');
const emailInput = document.getElementById('register-email');
const passwordInput = document.getElementById('register-password');
const confirmPasswordInput = document.getElementById(
  'register-confirm-password',
);
const registerError = document.getElementById('register-error');

const getUsers = () => JSON.parse(localStorage.getItem('users')) || [];

const validators = {
  'register-name': (value) =>
    value.trim().length >= 2
      ? { valid: true }
      : { valid: false, message: 'Please enter your name.' },

  'register-email': (value) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(value)
      ? { valid: true }
      : { valid: false, message: 'Please enter a valid email address.' };
  },

  'register-password': (value) =>
    value.length >= 6
      ? { valid: true }
      : { valid: false, message: 'Password must be at least 6 characters.' },

  'register-confirm-password': (value) =>
    value === passwordInput.value
      ? { valid: true }
      : { valid: false, message: "Passwords don't match." },
};

const validateAndDisplay = (input) => {
  const validator = validators[input.id];
  if (!validator) return true;

  const result = validator(input.value);
  const errorSpan = document.getElementById(`error-${input.id}`);

  if (result.valid) {
    input.classList.remove('input-error');
    input.classList.add('input-valid');
    errorSpan.textContent = '';
    errorSpan.classList.remove('show');
  } else {
    input.classList.remove('input-valid');
    input.classList.add('input-error');
    errorSpan.textContent = result.message;
    errorSpan.classList.add('show');
  }

  return result.valid;
};

[nameInput, emailInput, passwordInput, confirmPasswordInput].forEach(
  (input) => {
    input.addEventListener('blur', () => validateAndDisplay(input));
  },
);

const handleRegister = (event) => {
  event.preventDefault();
  registerError.hidden = true;

  const fieldsValid = [
    nameInput,
    emailInput,
    passwordInput,
    confirmPasswordInput,
  ]
    .map(validateAndDisplay)
    .every((result) => result === true);

  if (!fieldsValid) return;

  const users = getUsers();

  // some() answers one question: does ANY existing user already have
  // this email? We don't need the matching user itself, just yes/no.
  const emailTaken = users.some(
    (user) => user.email.toLowerCase() === emailInput.value.toLowerCase(),
  );

  if (emailTaken) {
    registerError.textContent = 'An account with this email already exists.';
    registerError.hidden = false;
    return;
  }

  const newUser = {
    id: Date.now(),
    name: nameInput.value,
    email: emailInput.value,
    password: passwordInput.value, // plain text — demo only, see README caveat
  };

  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));

  // Log them in immediately after registering.
  localStorage.setItem(
    'currentUser',
    JSON.stringify({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    }),
  );

  // If they were sent here from checkout (or anywhere else), go back
  // there now that they're logged in. Otherwise just go to the shop.
  const redirectTarget =
    sessionStorage.getItem('redirectAfterAuth') || 'shop.html';
  sessionStorage.removeItem('redirectAfterAuth');
  window.location.href = redirectTarget;
};

registerForm.addEventListener('submit', handleRegister);
