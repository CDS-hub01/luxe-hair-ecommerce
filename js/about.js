// about.js
// Handles the Contact form on the About page. There's no backend to
// actually send the message, so this simulates success: stops the
// real page reload, shows a confirmation banner, clears the form.

// ---- Step 1: Grab elements, in the same order they appear in the HTML ----
const contactForm = document.getElementById('contact-form');
const contactSuccess = document.getElementById('contact-success');
const contactNameInput = document.getElementById('contact-name');
const contactEmailInput = document.getElementById('contact-email');
const contactMessageInput = document.getElementById('contact-message');

// ---- Step 2: Handle the "submission" ----

const handleContactSubmit = (event) => {
  event.preventDefault();

  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    return;
  }

  // Save this message so admin.js can read it later.
  const message = {
    name: contactNameInput.value,
    email: contactEmailInput.value,
    message: contactMessageInput.value,
    timestamp: new Date().toISOString(),
    handled: false,
  };

  const existingMessages = JSON.parse(localStorage.getItem('messages')) || [];
  existingMessages.push(message);
  localStorage.setItem('messages', JSON.stringify(existingMessages));

  contactSuccess.hidden = false;
  contactForm.reset();

  setTimeout(() => {
    contactSuccess.hidden = true;
  }, 4000);
};

// ---- Step 3: Wire it up ----
contactForm.addEventListener('submit', handleContactSubmit);
