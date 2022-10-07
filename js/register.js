const form = document.getElementById("reg-form");
const usernameInput = document.getElementById("reg-username");
const emailInput = document.getElementById("reg-email");
const passwordInput = document.getElementById("reg-password");
const registerBtn = document.getElementById("reg-submit");
const errorMsg = document.getElementById("error-msg");

const usernameMsg = document.getElementById("reg-username-msg");
const emailMsg = document.getElementById("reg-email-msg");
const passwordMsg = document.getElementById("reg-password-msg");

const API_BASE_URL = "https://nf-api.onrender.com";

//Register end point: /api/v1/social/auth/register

// ------------- Formvalidering

registerBtn.addEventListener("click", validateForm);

function validateForm(e) {
  e.preventDefault();

  let submittedUsername = usernameInput.value.trim();
  console.log(`Username: ${submittedUsername}`);

  usernameMsg.innerHTML = "";
  if (submittedUsername.length < 5) {
    usernameMsg.innerHTML = "Username must be at least 5 characters long.";
  }
  let usernamePattern = /^[A-Za-z0-9_]+$/;
  if (!usernamePattern.test(submittedUsername)) {
    usernameMsg.innerHTML =
      "Username can only contain characters, digits and underscore.";
  }

  let submittedEmail = emailInput.value.trim();
  console.log(`Email: ${submittedEmail}`);

  emailMsg.innerHTML = "";

  let emailPattern = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
  if (!emailPattern.test(submittedEmail)) {
    emailMsg.innerHTML =
      "Please enter a valid email. Email must contain @stud.noroff.no or @noroff.no";
  }

  let submittedPassword = passwordInput.value.trim();
  console.log(`Message: ${submittedPassword}`);

  passwordMsg.innerHTML = "";
  if (submittedPassword.length < 8) {
    passwordMsg.innerHTML = "Password must be at least 8 characters long.";
  }
}

// ------------- Registers user

registerBtn.addEventListener("click", validateAndProcess);

function validateAndProcess(event) {
  event.preventDefault();
  console.log("du har trykket");

  const username = usernameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  const userToRegister = {
    name: username,
    email: email,
    password: password,
  };

  const registerUrl = `${API_BASE_URL}/api/v1/social/auth/register`;

  registerUSer(registerUrl, userToRegister);
}

async function registerUSer(url, userData) {
  console.log(url, userData);
  try {
    // caller api
    const postData = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    };
    const response = await fetch(url, postData);
    console.log(response);
    const json = await response.json();
    console.log(json);
    if (response.status === 201) {
      window.location = "../index.html";
    } else if (json.message === "Profile already exists") {
      errorMsg.innerHTML = `Profile already exists. Try to <a href="../index.html">log in</a> instead.`;
    }
  } catch (error) {
    console.log(error);
  }
}

//Vil lage dette inni fetchen:
// if response.status er lik 201 > bli sendt til log in siden, (redeirect med window.location.href??)
// else if response.status er lik 400 eller annet, skriv ut feilmelding i errorMsg.innerHTML FIKK DETTE TIL!

// Nytt probelm, valideringen funker ikke NÅ FUNKER VALIDERING OG REGISTRERING
