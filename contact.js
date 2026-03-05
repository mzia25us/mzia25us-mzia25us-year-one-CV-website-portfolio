// this is contact.js
//It handles: 
//- Form validation (client-side)
//- Showing a confirmation modal with the user's input.
//- Simulated confirmation (no real email is sent)*/
  
//Destination email which is my email.
const ASTON_EMAIL = "250118283@aston.ac.uk"; // e.g. "ziaM1@aston.ac.uk"

//These will reference the necessary DOM  elements
const form = document.getElementById("contactForm");
const modal = document.getElementById("modal");
const modalTo = document.getElementById("modalTo");
const modalFrom = document.getElementById("modalFrom");
const modalSummary = document.getElementById("modalSummary");
const cancelBtn = document.getElementById("cancelBtn");
const confirmBtn = document.getElementById("confirmBtn");

//Error handling helpers. 
//setError() writes a message into the <small> element.
//clearErrors() resets all error meesages

function setError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}

function clearErrors() {
  setError("errFirstName", "");
  setError("errPhone", "");
  setError("errEmail", "");
  setError("errConfirmEmail", "");
  setError("errDate", "");
  setError("errDuration", "");
  setError("errDesc", "");
  setError("errPref", "");
}

//REQUIRED: checks email matches confirm email. COmpares case-insensitively
function checkEmails(email, confirmEmail) {
  return email.trim().toLowerCase() === confirmEmail.trim().toLowerCase();
}

//REQUIRED: checks date is at least 1 day in the future 
function checkDate(dateStr) {
  if (!dateStr) return false;

  // Create "today" at midnight
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Selected date at midnight
  const selected = new Date(dateStr + "T00:00:00");

  //Difference in days
  const diffMs = selected - today;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  //Makes sure it must be at least 1 day in the future.
  return diffDays >= 1;
}

//REQUIRED: This is the main validation function. 
 //* checks the required fields.
 //* checks email confirmation
 //* checks date and durations rules
 //* returns:
 //* null is invalid
 //* a data object if valid
function validateForm() {
  clearErrors();

  //Read values from inputs
  const firstName = document.getElementById("firstName").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();
  const confirmEmail = document.getElementById("confirmEmail").value.trim();
  const startDate = document.getElementById("startDate").value;
  const duration = document.getElementById("duration").value.trim();
  const description = document.getElementById("description").value.trim();
  const pref = document.querySelector('input[name="contactPref"]:checked');

  let ok = true;

  //These are all the reuiqred checks.
  if (!firstName) {
    setError("errFirstName", "Please enter your first name.");
    ok = false;
  }

  if (!phone) {
    setError("errPhone", "Please enter your phone number.");
    ok = false;
  }

  if (!email) {
    setError("errEmail", "Please enter your email.");
    ok = false;
  }

  //Email matching here.
  if (!confirmEmail) {
    setError("errConfirmEmail", "Please confirm your email.");
    ok = false;
  }

  if (email && confirmEmail && !checkEmails(email, confirmEmail)) {
    setError("errConfirmEmail", "Emails do not match.");
    ok = false;
  }

  //Date rule of at least one day in the future.
  if (!startDate) {
    setError("errDate", "Please choose a project date.");
    ok = false;
  } else if (!checkDate(startDate)) {
    setError("errDate", "Date must be at least 1 day in the future.");
    ok = false;
  }

  //Duration rule of more than one day in the future.
  if (!duration) {
    setError("errDuration", "Please enter a duration in days.");
    ok = false;
  } else if (Number.isNaN(Number(duration)) || Number(duration) < 1) {
    setError("errDuration", "Duration must be at least 1 day.");
    ok = false;
  }

  //Text area
  if (!description) {
    setError("errDesc", "Please describe your project.");
    ok = false;
  }

  //Selection buttons. Radio buttons.
  if (!pref) {
    setError("errPref", "Please choose how you prefer to be contacted.");
    ok = false;
  }

  if (!ok) return null;

  //This will return a clean data object for modal display.
  return {
    firstName,
    phone,
    email,
    startDate,
    duration: Number(duration),
    description,
    contactPref: pref.value
  };
}

//MODAL LOGIC
//- openModal() inserts the user details into modals and shows it.
//- closeModal() hides modal.*/

function openModal(data) {
  //Populate "to" and "from" fields.
  modalTo.textContent = ASTON_EMAIL;
  modalFrom.textContent = data.email;

  modalSummary.innerHTML = `
    <p><strong>Name:</strong> ${escapeHtml(data.firstName)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>
    <p><strong>Preferred contact:</strong> ${escapeHtml(data.contactPref)}</p>
    <p><strong>Project date:</strong> ${escapeHtml(data.startDate)}</p>
    <p><strong>Duration:</strong> ${data.duration} day(s)</p>
    <p><strong>Description:</strong><br>${escapeHtml(data.description).replace(/\n/g, "<br>")}</p>
  `;

  //show modal
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

//Prevents user input from being treated as real HTML.
function escapeHtml(str) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

//Submit handler: prevents page reload, validates form, opens confirmation modal if valid.
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = validateForm();
  if (!data) return;
  openModal(data);
});

//This closes the modal without submitting.
cancelBtn.addEventListener("click", closeModal);

//Confirm button:
//- closes modal
//- shows success message, no actually sending to email.
//- resets the firm

confirmBtn.addEventListener("click", () => {
  closeModal();
  alert("Confirmed! (No email was sent — this is just a simulation.)");
  form.reset();
  clearErrors();
});
