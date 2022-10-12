const form = document.getElementById("login-form");
const emailInput = document.getElementById("login-email");
const passwordInput = document.getElementById("login-password");
const loginBtn = document.getElementById("login-submit");

const usernameMsg = document.getElementById("login-username-msg");
const emailMsg = document.getElementById("login-email-msg");
const passwordMsg = document.getElementById("login-password-msg");

const API_BASE_URL = "https://nf-api.onrender.com";

// ------------- Formvalidering
loginBtn.addEventListener("click", validateForm);

function validateForm(e) {
  e.preventDefault();

  let submittedEmail = emailInput.value.trim();
  console.log(`Email: ${submittedEmail}`);

  emailMsg.innerHTML = "";

  let emailPattern = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
  if (!emailPattern.test(submittedEmail)) {
    emailMsg.innerHTML =
      "Please enter a valid email. Email must contain @stud.noroff.no or @noroff.no";
  }

  if (submittedEmail !== localStorage.getItem("email")) {
    emailMsg.innerHTML = "User with this email does not exist.";
  }

  let submittedPassword = passwordInput.value.trim();
  console.log(`Message: ${submittedPassword}`);

  passwordMsg.innerHTML = "";
  if (submittedPassword.length < 8) {
    passwordMsg.innerHTML = "Password must be at least 8 characters long.";
  }
}

// ------------ Login user

loginBtn.addEventListener("click", validateAndProcess);
function validateAndProcess(event) {
  event.preventDefault();
  //console.log("du har trykket");

  const data = {
    email: emailInput.value.trim(),
    password: passwordInput.value.trim(),
  };

  const loginUrl = `${API_BASE_URL}/api/v1/social/auth/login`;

  loginUser(loginUrl, data);
}

async function loginUser(url, data) {
  try {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    console.log(url, data, options);

    const response = await fetch(url, options);
    console.log(response);
    const answer = await response.json();
    console.log(answer);

    localStorage.setItem("username", answer.name);
    localStorage.setItem("accessToken", answer.accessToken);
    if (response.status === 200) {
      window.location = "../home-feed.html";
    }
  } catch (error) {
    console.warn(error);
  }
}

//Her vil jeg:
// Sjekke om brukernavn og passord finnes i database
// Hvis response.status er lik 200 > send til homefeed.html (redeirect med window.location.href??)
// Hvis annen status kode > skriv ut feilmelding i errorMsg
